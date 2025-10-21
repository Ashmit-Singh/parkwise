"""
ParkWise Behavioral Intervention Analysis Script
Analyzes A/B test results and generates statistical reports
"""

import pandas as pd
import numpy as np
from scipy import stats
from datetime import datetime
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ExperimentAnalyzer:
    """Analyze behavioral intervention experiments"""

    def __init__(self, donation_data_path, event_log_path=None):
        """
        Initialize analyzer with data paths
        
        Args:
            donation_data_path: Path to CSV with donation events
            event_log_path: Path to CSV with user event logs
        """
        self.donations_df = pd.read_csv(donation_data_path)
        self.events_df = pd.read_csv(event_log_path) if event_log_path else None
        logger.info(f"Loaded {len(self.donations_df)} donation records")

    def calculate_conversion_rate(self):
        """Calculate conversion rate by variant"""
        logger.info("Calculating conversion rates...")
        
        # Group by variant
        variant_stats = self.donations_df.groupby('variant').agg({
            'user_id': 'nunique',  # unique users
            'donation_status': lambda x: (x == 'COMPLETED').sum()  # completed donations
        }).rename(columns={'user_id': 'total_users', 'donation_status': 'completed_donations'})
        
        variant_stats['conversion_rate'] = (
            variant_stats['completed_donations'] / variant_stats['total_users'] * 100
        )
        
        return variant_stats

    def calculate_donation_metrics(self):
        """Calculate donation amount statistics by variant"""
        logger.info("Calculating donation metrics...")
        
        # Filter completed donations only
        completed = self.donations_df[self.donations_df['donation_status'] == 'COMPLETED']
        
        metrics = completed.groupby('variant')['donation_amount'].agg([
            ('count', 'count'),
            ('mean', 'mean'),
            ('median', 'median'),
            ('std', 'std'),
            ('min', 'min'),
            ('max', 'max'),
            ('sum', 'sum')
        ]).round(2)
        
        return metrics

    def calculate_repeat_donation_rate(self):
        """Calculate repeat donation rate by variant"""
        logger.info("Calculating repeat donation rates...")
        
        # Count donations per user per variant
        user_donation_counts = self.donations_df[
            self.donations_df['donation_status'] == 'COMPLETED'
        ].groupby(['user_id', 'variant']).size().reset_index(name='donation_count')
        
        repeat_stats = user_donation_counts.groupby('variant').agg({
            'donation_count': [
                ('total_users', 'count'),
                ('repeat_donors', lambda x: (x > 1).sum()),
                ('avg_donations_per_user', 'mean')
            ]
        }).round(2)
        
        repeat_stats.columns = ['_'.join(col).strip() for col in repeat_stats.columns.values]
        repeat_stats['repeat_rate'] = (
            repeat_stats['donation_count_repeat_donors'] / 
            repeat_stats['donation_count_total_users'] * 100
        ).round(2)
        
        return repeat_stats

    def statistical_test_conversion(self):
        """Perform chi-square test on conversion rates"""
        logger.info("Performing chi-square test on conversion rates...")
        
        # Create contingency table
        contingency_data = []
        for variant in self.donations_df['variant'].unique():
            variant_data = self.donations_df[self.donations_df['variant'] == variant]
            completed = (variant_data['donation_status'] == 'COMPLETED').sum()
            not_completed = (variant_data['donation_status'] != 'COMPLETED').sum()
            contingency_data.append([completed, not_completed])
        
        contingency_table = np.array(contingency_data)
        chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)
        
        results = {
            'chi2_statistic': chi2,
            'p_value': p_value,
            'degrees_of_freedom': dof,
            'significant': p_value < 0.05
        }
        
        logger.info(f"Chi-square test results: {results}")
        return results

    def statistical_test_donation_amount(self):
        """Perform t-test on donation amounts between variants"""
        logger.info("Performing t-test on donation amounts...")
        
        completed = self.donations_df[self.donations_df['donation_status'] == 'COMPLETED']
        variants = completed['variant'].unique()
        
        if len(variants) < 2:
            logger.warning("Need at least 2 variants for t-test")
            return None
        
        results = {}
        for i, variant1 in enumerate(variants):
            for variant2 in variants[i+1:]:
                group1 = completed[completed['variant'] == variant1]['donation_amount']
                group2 = completed[completed['variant'] == variant2]['donation_amount']
                
                t_stat, p_value = stats.ttest_ind(group1, group2)
                
                key = f"{variant1}_vs_{variant2}"
                results[key] = {
                    't_statistic': t_stat,
                    'p_value': p_value,
                    'significant': p_value < 0.05,
                    'mean_diff': group1.mean() - group2.mean()
                }
        
        logger.info(f"T-test results: {results}")
        return results

    def calculate_effect_size(self):
        """Calculate Cohen's d effect size between variants"""
        logger.info("Calculating effect sizes...")
        
        completed = self.donations_df[self.donations_df['donation_status'] == 'COMPLETED']
        variants = completed['variant'].unique()
        
        results = {}
        for i, variant1 in enumerate(variants):
            for variant2 in variants[i+1:]:
                group1 = completed[completed['variant'] == variant1]['donation_amount']
                group2 = completed[completed['variant'] == variant2]['donation_amount']
                
                # Cohen's d
                n1, n2 = len(group1), len(group2)
                var1, var2 = group1.var(), group2.var()
                pooled_std = np.sqrt(((n1-1)*var1 + (n2-1)*var2) / (n1 + n2 - 2))
                cohens_d = (group1.mean() - group2.mean()) / pooled_std if pooled_std > 0 else 0
                
                key = f"{variant1}_vs_{variant2}"
                results[key] = {
                    'cohens_d': cohens_d,
                    'effect_size': self._interpret_cohens_d(cohens_d)
                }
        
        logger.info(f"Effect sizes: {results}")
        return results

    @staticmethod
    def _interpret_cohens_d(d):
        """Interpret Cohen's d value"""
        abs_d = abs(d)
        if abs_d < 0.2:
            return 'negligible'
        elif abs_d < 0.5:
            return 'small'
        elif abs_d < 0.8:
            return 'medium'
        else:
            return 'large'

    def generate_report(self, output_path='experiment_report.json'):
        """Generate comprehensive analysis report"""
        logger.info("Generating comprehensive report...")
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_donations': len(self.donations_df),
                'unique_users': self.donations_df['user_id'].nunique(),
                'variants': list(self.donations_df['variant'].unique())
            },
            'conversion_rates': self.calculate_conversion_rate().to_dict(),
            'donation_metrics': self.calculate_donation_metrics().to_dict(),
            'repeat_donation_rates': self.calculate_repeat_donation_rate().to_dict(),
            'statistical_tests': {
                'chi_square': self.statistical_test_conversion(),
                't_tests': self.statistical_test_donation_amount(),
                'effect_sizes': self.calculate_effect_size()
            }
        }
        
        # Save report
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        logger.info(f"Report saved to {output_path}")
        return report

    def print_summary(self):
        """Print summary statistics"""
        print("\n" + "="*60)
        print("PARKWISE BEHAVIORAL INTERVENTION ANALYSIS")
        print("="*60)
        
        print("\n📊 CONVERSION RATES BY VARIANT:")
        print(self.calculate_conversion_rate())
        
        print("\n💰 DONATION METRICS BY VARIANT:")
        print(self.calculate_donation_metrics())
        
        print("\n🔄 REPEAT DONATION RATES:")
        print(self.calculate_repeat_donation_rate())
        
        print("\n📈 STATISTICAL SIGNIFICANCE:")
        chi_results = self.statistical_test_conversion()
        print(f"Chi-square p-value: {chi_results['p_value']:.4f}")
        print(f"Significant: {'Yes' if chi_results['significant'] else 'No'}")
        
        print("\n" + "="*60 + "\n")


if __name__ == '__main__':
    # Example usage
    analyzer = ExperimentAnalyzer(
        donation_data_path='donation_events.csv',
        event_log_path='user_event_log.csv'
    )
    
    # Generate report
    report = analyzer.generate_report('experiment_report.json')
    
    # Print summary
    analyzer.print_summary()
