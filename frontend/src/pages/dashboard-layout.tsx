import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/global/sidebar'
import { Outlet, useParams } from 'react-router-dom'

export default function DashboardLayout() {
  const { slug = 'workspace' } = useParams()

  return (
    <div className="p-3">
      <Sidebar slug={slug} />
      <div className="lg:ml-[250px] lg:pl-10 lg:py-5 flex flex-col overflow-auto">
        <InfoBar slug={slug} />
        <Outlet />
      </div>
    </div>
  )
}
