
/**
 * 民办学校年检申报平台 API Server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const mockSchoolInfo = {
  id: 'SCH-2024-001',
  schoolName: '启明外国语实验学校',
  schoolStage: 'junior',
  unifiedCreditCode: '91310115MA1K3XXXX',
  licenseNumber: '教民131011540001234号',
  organizer: '上海启明教育投资有限公司',
  principal: '王建国',
  legalPerson: '张明德',
  legalPersonIdCard: '310101197001011234',
  businessScope: ['初中阶段学历教育', '课外兴趣培训'],
  licenseValidFrom: '2022-03-15',
  licenseValidTo: '2027-03-14',
  schoolAddress: '上海市浦东新区张江高科技园区博云路 2 号',
  buildingArea: 18500,
  propertyType: 'leased',
  chargingItems: [
    { id: 'ci1', name: '学杂费', standard: '18000', unit: '元/学期', approvalNumber: '浦发改价[2023]89号' },
    { id: 'ci2', name: '住宿费', standard: '4200', unit: '元/学期', approvalNumber: '浦发改价[2023]90号' },
    { id: 'ci3', name: '伙食费', standard: '30', unit: '元/天', approvalNumber: '浦发改价[2023]91号' },
  ],
  consistencyCheck: {
    passed: false,
    issues: [
      {
        field: 'buildingArea',
        fieldLabel: '校舍建筑面积',
        currentValue: '18500',
        expectedValue: '20000',
        severity: 'warning',
        message: '当前填报面积与办学许可证记载面积 20000㎡ 存在差异，请确认是否有改扩建备案。',
      },
    ],
  },
}

const mockIndicatorCategories = [
  { id: 'c1', name: '办学条件', icon: 'Building2', totalItems: 8, completedItems: 6 },
  { id: 'c2', name: '师资队伍', icon: 'Users', totalItems: 10, completedItems: 8 },
  { id: 'c3', name: '教育教学', icon: 'GraduationCap', totalItems: 7, completedItems: 7 },
  { id: 'c4', name: '财务管理', icon: 'Wallet', totalItems: 6, completedItems: 4 },
  { id: 'c5', name: '安全管理', icon: 'ShieldCheck', totalItems: 9, completedItems: 9 },
]

const mockProgress = {
  currentStage: 4,
  totalStages: 6,
  stageNames: ['基础信息', '指标填报', '佐证材料', '校内审核', '教育局审查', '年检完成'],
  stageStatuses: ['completed', 'completed', 'completed', 'current', 'pending', 'pending'],
  overallPercentage: 68,
  submissionDeadline: '2026-06-30',
}

function ok<T>(res: Response, data: T, message = 'ok') {
  res.status(200).json({ success: true, data, message })
}

app.use('/api/auth', authRoutes)

app.get('/api/health', (_req: Request, res: Response) => {
  ok(res, { timestamp: new Date().toISOString() })
})

app.get('/api/school-info', (_req: Request, res: Response) => {
  ok(res, mockSchoolInfo)
})

app.put('/api/school-info', (_req: Request, res: Response) => {
  ok(res, { ...mockSchoolInfo, ..._req.body }, '更新成功')
})

app.post('/api/school-info/apply-last-year', (_req: Request, res: Response) => {
  ok(res, { ...mockSchoolInfo, consistencyCheck: { passed: true, issues: [] } }, '已沿用上年度数据')
})

app.get('/api/indicator-categories', (_req: Request, res: Response) => {
  ok(res, mockIndicatorCategories)
})

app.get('/api/progress/overview', (_req: Request, res: Response) => {
  ok(res, mockProgress)
})

app.get('/api/progress/notifications', (_req: Request, res: Response) => {
  ok(res, [
    {
      id: 'n1',
      type: 'deadline',
      title: '距年检申报截止还剩 12 天',
      message: '2025 年度民办学校年检申报将于 2026-06-30 截止，请在截止日前完成报送。',
      read: false,
      createdAt: '2026-06-18 08:00',
      deadline: '2026-06-30',
    },
    {
      id: 'n2',
      type: 'error',
      title: '指标填报存在 2 项错项',
      message: '【教学仪器设备总值】和【学校总资产】字段尚未填写，请尽快补充。',
      read: false,
      createdAt: '2026-06-17 16:30',
    },
    {
      id: 'n3',
      type: 'missing',
      title: '材料存在 2 项缺项',
      message: '证照类缺少 1 份必传材料，财务类缺少 1 份必传材料。',
      read: false,
      createdAt: '2026-06-17 15:10',
    },
    {
      id: 'n4',
      type: 'info',
      title: '收到 2 条整改事项',
      message: '教育局审查员于 2026-06-15 提出 2 条整改意见，请及时处理。',
      read: true,
      createdAt: '2026-06-15 09:35',
    },
  ])
})

app.use((_error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ success: false, error: 'Server internal error' })
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API not found' })
})

export default app
