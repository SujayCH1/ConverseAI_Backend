import IntegrationCard from '@/components/integrations/integration-card'
import { INTEGRATION_CARDS } from '@/constants/integrations'

export default function IntegrationsPage() {
  return <div className="flex justify-center"><div className="flex flex-col w-full lg:w-8/12 gap-y-5">{INTEGRATION_CARDS.map((card, key) => <IntegrationCard key={key} {...card} />)}</div></div>
}
