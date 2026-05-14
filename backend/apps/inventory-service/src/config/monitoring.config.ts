export default () => ({
  monitoring: {
    prometheusEnabled: process.env.PROMETHEUS_ENABLED === 'true',
  },
});
