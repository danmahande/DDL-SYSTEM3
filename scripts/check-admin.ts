import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@ddl.com'
  const passwordToCheck = process.env.CHECK_PASSWORD || 'ChangeMe123!'

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.log(`User not found for email=${email}`)
    return
  }

  console.log('User found:')
  console.log({ id: user.id, email: user.email, isActive: user.isActive, role: user.role })

  const matches = bcrypt.compareSync(passwordToCheck, user.password)
  console.log(`Password match for '${passwordToCheck}': ${matches}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
