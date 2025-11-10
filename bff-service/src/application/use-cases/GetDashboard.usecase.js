class GetDashboardUseCase {
  constructor(gatewayRepository) {
    this.gatewayRepository = gatewayRepository;
  }

  async execute(token) {
    const dashboard = await this.gatewayRepository.getDashboard(token);
    return dashboard;
  }
}

module.exports = GetDashboardUseCase;
