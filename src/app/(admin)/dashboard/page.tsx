'use client'

import { Card } from "@/components/ui/card"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js'
import { Users, DollarSign, Package, TrendingUp } from 'lucide-react'

// Đăng ký các components của ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

export default function DashboardPage() {
  // Data mẫu cho biểu đồ
  const barData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [{
      label: 'Doanh thu',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(14, 165, 233, 0.5)',
    }]
  }

  const lineData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [{
      label: 'Đơn hàng',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgb(14, 165, 233)',
      tension: 0.1
    }]
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Khách hàng</p>
              <h3 className="text-xl font-bold">2,450</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Doanh thu</p>
              <h3 className="text-xl font-bold">$12,450</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sản phẩm</p>
              <h3 className="text-xl font-bold">450</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tăng trưởng</p>
              <h3 className="text-xl font-bold">+12.5%</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
          <Bar data={barData} />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Đơn hàng theo tháng</h3>
          <Line data={lineData} />
        </Card>
      </div>

      {/* Danh sách đơn hàng gần đây */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">#ORD-{item}234</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Khách hàng {item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${Math.floor(Math.random() * 1000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Hoàn thành
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}