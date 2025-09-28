#!/usr/bin/env python3
"""
사용자 생성 및 조회 테스트 스크립트

users 테이블이 정상적으로 작동하는지 확인합니다.
"""

import asyncio
import sys
import os

# 프로젝트 루트를 Python path에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.common.database import db_manager
from app.domains.auth.models import User
from sqlmodel import select


async def test_user_operations():
    """사용자 생성 및 조회 테스트"""
    print("🧪 사용자 생성 테스트 중...")
    
    try:
        # 테스트 사용자 데이터
        test_user = User(
            email='test@example.com',
            hashed_password='hashed_password_123',
            full_name='테스트 사용자',
            tenant_id='tenant_001',
            role='viewer'
        )
        
        async with db_manager.SessionLocal() as session:
            # 사용자 생성
            session.add(test_user)
            await session.commit()
            await session.refresh(test_user)
            print(f'✅ 사용자 생성 성공! ID: {test_user.id}')
            
            # 사용자 조회 테스트
            result = await session.execute(select(User).where(User.email == 'test@example.com'))
            user = result.scalar_one_or_none()
            if user:
                print(f'✅ 사용자 조회 성공! 이름: {user.full_name}, 역할: {user.role}')
                print(f'   이메일: {user.email}, 테넌트: {user.tenant_id}')
                print(f'   활성 상태: {user.is_active}, 생성일: {user.created_at}')
            else:
                print('❌ 사용자 조회 실패')
                
            # 모든 사용자 조회
            result = await session.execute(select(User))
            all_users = result.scalars().all()
            print(f'📊 총 사용자 수: {len(all_users)}')
            for u in all_users:
                print(f'   - {u.email} ({u.full_name})')
                
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # 데이터베이스 연결 종료
        await db_manager.close()


if __name__ == "__main__":
    asyncio.run(test_user_operations())

