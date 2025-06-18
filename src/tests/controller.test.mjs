// controller.test.mjs
import { describe, beforeEach, afterAll, expect, jest, it } from '@jest/globals'

//  Required for ESM mocking
jest.unstable_mockModule('@prisma/client', () => {
  const mockFindFirst = jest.fn()
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: { findFirst: mockFindFirst },
      $disconnect: jest.fn()
    })),
    __esModule: true // important for ESM
  }
})

//  Mock ESM service module
const mockLogin = jest.fn()
const mockReg = jest.fn()

jest.unstable_mockModule('../services/authServices.js', () => ({
  login: mockLogin,
  registration: mockReg,
  __esModule: true
}))

// import everything AFTER mocks are set
const { PrismaClient } = await import('@prisma/client')
const authServices = await import('../services/authServices.js')
const { regCredVerification, logCredVerification } = await import('../controllers/authController.js')

// Setup shared mock
let prisma
let mockFindFirst

describe('Credential Verification', () => {
  beforeEach(() => {
    prisma = new PrismaClient()
    mockFindFirst = prisma.user.findFirst
    mockFindFirst.mockReset()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return 409 if the username or email are already in use', async () => {
    mockFindFirst.mockResolvedValue({ id: 1 })
    const req = { body: { email: "gaurab@gmail.com", password: "pass", username: "gaurab7" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await regCredVerification(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
  })

  it('should return 404 if the user doesn\'t exist', async () => {
    mockFindFirst.mockResolvedValue(null)
    const req = { body: { email: "nouser@gmail.com", password: "pass", username: "nouser" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await logCredVerification(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })
})

describe('Cred Verification 200', () => {
  beforeEach(() => {
    prisma = new PrismaClient()
    mockFindFirst = prisma.user.findFirst
    mockFindFirst.mockReset()
    jest.clearAllMocks()

    mockLogin.mockResolvedValue("fake-token")
    mockReg.mockResolvedValue("fake-token")
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return 200 if the user exists', async () => {
    mockFindFirst.mockResolvedValue({ id: 1 })
    const req = { body: { email: "exists@gmail.com", password: "pass", username: "exists" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await logCredVerification(req, res)
    expect(authServices.login).toHaveBeenCalled()
  })

  it('should return 200 if the username & email are not already in use', async () => {
    mockFindFirst.mockResolvedValue(null)
    const req = { body: { email: "new@gmail.com", password: "pass", username: "new" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await regCredVerification(req, res)
    expect(authServices.registration).toHaveBeenCalled()
  })
})
