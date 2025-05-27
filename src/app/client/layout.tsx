import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thời Trang Nữ Sang Trọng & Đẳng Cấp',
  description: 'Khám phá bộ sưu tập thời trang nữ độc đáo và tinh tế. Tôn vinh vẻ đẹp phái nữ với những mẫu thời trang đẳng cấp.',
  keywords: 'Thời trang nữ, thời trang cao cấp, sang trọng, đầm dự tiệc, áo dài',
  openGraph: {
    title: 'Thời Trang Nữ Sang Trọng & Đẳng Cấp',
    description: 'Khám phá bộ sưu tập thời trang nữ độc đáo và tinh tế.',
    images: ['/img/banner2.jpg'],
  }
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}