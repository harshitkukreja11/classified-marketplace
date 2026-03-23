import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// #region agent log
fetch('http://127.0.0.1:7881/ingest/aa5880ae-69a3-4d73-9d96-9ad331584174',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d69bc1'},body:JSON.stringify({sessionId:'d69bc1',location:'src/lib/prisma.js:before-new-PrismaClient',message:'Prisma init preflight',data:{databaseUrlIsSet:!!process.env.DATABASE_URL,databaseUrlLength:(process.env.DATABASE_URL||'').length,nodeEnv:process.env.NODE_ENV,typeofProcess:typeof process},timestamp:Date.now()} )}).catch(()=>{});
// #endregion

export const prisma = (() => {
  try {
    return globalForPrisma.prisma || new PrismaClient();
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7881/ingest/aa5880ae-69a3-4d73-9d96-9ad331584174',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d69bc1'},body:JSON.stringify({sessionId:'d69bc1',location:'src/lib/prisma.js:new-PrismaClient-catch',message:'PrismaClient constructor threw',data:{errorName:e && e.name,errorMessage:e && e.message ? String(e.message).slice(0,300) : String(e),typeofProcess:typeof process},timestamp:Date.now()} )}).catch(()=>{});
    // #endregion
    throw e;
  }
})();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}