'use client'

import { useTranslation } from 'react-i18next'
import Layout from '@/components/Layout/Layout'
import IssueHeatmap from '@/components/IssueHeatmap'

export default function HeatmapPage() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('issueHeatmap')}</h1>
            <p className="text-gray-600 mt-1">{t('visualizeIssueDistribution')}</p>
          </div>
        </div>

        {/* Heatmap Component */}
        <IssueHeatmap adminId="admin-123" />
      </div>
    </Layout>
  )
}