const GetDashboardUseCase = require('../../application/use-cases/GetDashboard.usecase');
const GatewayRepository = require('../../infrastructure/gateway/GatewayRepository');

class DashboardFeature {
  constructor() {
    this.gatewayRepository = new GatewayRepository();
    this.getDashboardUseCase = new GetDashboardUseCase(this.gatewayRepository);
  }

  async handle(req, res) {
    try {
      const token = req.token;
      const dashboard = await this.getDashboardUseCase.execute(token);
      
      res.status(200).json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = DashboardFeature;
