#!/usr/bin/env python3
"""
데이터베이스 테이블 생성 스크립트

SQLModel 기반으로 users 테이블을 생성합니다.
"""

import asyncio
import sys
import os

# 프로젝트 루트를 Python path에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.common.database import db_manager
from app.domains.auth.models import User
from sqlmodel import SQLModel
from sqlalchemy import text


async def create_tables():
    """데이터베이스 테이블을 생성합니다."""
    print("🔄 데이터베이스 테이블 생성 중...")
    
    try:
        # 기존 테이블 확인
        async with db_manager.engine.begin() as conn:
            result = await conn.execute(text('SELECT name FROM sqlite_master WHERE type="table"'))
            existing_tables = result.fetchall()
            print(f"📋 기존 테이블: {[table[0] for table in existing_tables]}")
            
            # User 모델이 SQLModel.metadata에 등록되었는지 확인
            print(f"📊 SQLModel 메타데이터 테이블: {list(SQLModel.metadata.tables.keys())}")
            
            # 모든 테이블 생성
            await conn.run_sync(SQLModel.metadata.create_all)
            print("✅ 테이블 생성 완료!")
            
            # 생성 후 테이블 확인
            result = await conn.execute(text('SELECT name FROM sqlite_master WHERE type="table"'))
            created_tables = result.fetchall()
            print(f"🎯 생성된 테이블: {[table[0] for table in created_tables]}")
            
            # users 테이블 구조 확인
            if any(table[0] == 'users' for table in created_tables):
                result = await conn.execute(text("PRAGMA table_info(users)"))
                columns = result.fetchall()
                print("📝 users 테이블 구조:")
                for col in columns:
                    print(f"  - {col[1]} ({col[2]}) {'NOT NULL' if col[3] else 'NULL'} {'PRIMARY KEY' if col[5] else ''}")
            else:
                print("❌ users 테이블이 생성되지 않았습니다.")
                
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # 데이터베이스 연결 종료
        await db_manager.close()


if __name__ == "__main__":
    asyncio.run(create_tables())
