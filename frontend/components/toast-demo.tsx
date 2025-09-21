"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

/**
 * 토스트 데모 컴포넌트
 * 
 * @description
 * - 새로운 토스트 시스템의 다양한 사용법을 보여주는 데모 컴포넌트
 * - success, error, warning, info, default 변형 모두 테스트 가능
 * - 액션 버튼이 있는 토스트와 일반 토스트 모두 지원
 * - 지속시간 설정 및 수동 닫기 기능 포함
 */
export function ToastDemo() {
  const { toast, dismissAll } = useToast()

  /**
   * 성공 토스트 표시
   * 
   * @description
   * - 문서 업로드, 처리 완료 등 성공적인 작업에 사용
   * - 초록색 배경과 체크 아이콘으로 시각적 피드백 제공
   */
  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: "문서 업로드 완료!",
      description: "PDF 파일이 성공적으로 업로드되었습니다.",
      duration: 4000,
    })
  }

  /**
   * 에러 토스트 표시
   * 
   * @description
   * - 업로드 실패, 처리 오류 등 문제 상황에 사용
   * - 빨간색 배경과 경고 아이콘으로 주의 환기
   */
  const showErrorToast = () => {
    toast({
      variant: "error",
      title: "업로드 실패",
      description: "파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.",
      duration: 6000,
    })
  }

  /**
   * 경고 토스트 표시
   * 
   * @description
   * - 주의가 필요한 상황이나 권장사항 알림에 사용
   * - 노란색 배경과 삼각형 경고 아이콘으로 표시
   */
  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: "용량 한도 임박",
      description: "현재 사용량이 80%에 도달했습니다. 스토리지 업그레이드를 고려해보세요.",
      duration: 5000,
    })
  }

  /**
   * 정보 토스트 표시
   * 
   * @description
   * - 일반적인 정보나 팁 제공에 사용
   * - 파란색 배경과 정보 아이콘으로 표시
   */
  const showInfoToast = () => {
    toast({
      variant: "info",
      title: "새로운 기능 출시",
      description: "RAG 콘솔에서 이제 실시간 스트림 응답을 지원합니다!",
      duration: 5000,
    })
  }

  /**
   * 기본 토스트 표시
   * 
   * @description
   * - 특별한 변형이 필요 없는 일반적인 알림에 사용
   * - 기본 테마 색상으로 표시
   */
  const showDefaultToast = () => {
    toast({
      variant: "default",
      title: "알림",
      description: "새로운 메시지가 도착했습니다.",
    })
  }

  /**
   * 액션이 있는 토스트 표시
   * 
   * @description
   * - 사용자가 추가 작업을 수행할 수 있는 토스트
   * - 예: 실패한 작업 재시도, 상세 정보 보기 등
   */
  const showActionToast = () => {
    toast({
      variant: "error",
      title: "OCR 처리 실패",
      description: "문서에서 텍스트를 추출하는 중 오류가 발생했습니다.",
      duration: 0, // 수동으로 닫을 때까지 표시
      action: (
        <ToastAction onClick={() => console.log("재시도 클릭됨")}>
          재시도
        </ToastAction>
      ),
    })
  }

  /**
   * 영구 토스트 표시
   * 
   * @description
   * - duration을 0으로 설정하여 자동으로 사라지지 않는 토스트
   * - 중요한 정보나 사용자 액션이 필요한 경우에 사용
   */
  const showPersistentToast = () => {
    toast({
      variant: "warning",
      title: "계정 확인 필요",
      description: "이메일 인증을 완료해주세요. 인증 링크가 만료되었습니다.",
      duration: 0, // 영구 표시
    })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6">토스트 알림 데모</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          성공 토스트
        </button>
        
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          에러 토스트
        </button>
        
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          경고 토스트
        </button>
        
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          정보 토스트
        </button>
        
        <button
          onClick={showDefaultToast}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          기본 토스트
        </button>
        
        <button
          onClick={showActionToast}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          액션 토스트
        </button>
        
        <button
          onClick={showPersistentToast}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          영구 토스트
        </button>
        
        <button
          onClick={dismissAll}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
        >
          모든 토스트 닫기
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">사용법:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• 각 버튼을 클릭하여 다양한 토스트 타입을 테스트하세요</li>
          <li>• 토스트는 우상단에 표시되며 자동으로 사라집니다</li>
          <li>• X 버튼을 클릭하거나 호버하여 수동으로 닫을 수 있습니다</li>
          <li>• &quot;모든 토스트 닫기&quot; 버튼으로 모든 토스트를 한번에 제거할 수 있습니다</li>
          <li>• 영구 토스트는 수동으로 닫을 때까지 표시됩니다</li>
        </ul>
      </div>
    </div>
  )
}
