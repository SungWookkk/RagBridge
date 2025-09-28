"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Plus,
  FolderOpen,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentUpload } from "@/hooks/use-document-upload";
import { useToast } from "@/hooks/use-toast";

/**
 * 문서 업로드 컴포넌트
 *
 * @description
 * - 드래그 앤 드롭 파일 업로드
 * - 멀티파일 업로드 지원
 * - 업로드 진행률 및 상태 표시
 * - 파일 타입 검증 및 미리보기
 * - 업로드 완료 후 CTA 제공
 */
export function DocumentUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    uploadFiles,
    uploadStatus,
    isUploading,
    retryUpload,
  } = useDocumentUpload();

  /**
   * 지원되는 파일 타입
   */
  const supportedFileTypes = [
    { type: "application/pdf", extension: "pdf", icon: <FileText className="h-4 w-4" /> },
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extension: "docx", icon: <FileText className="h-4 w-4" /> },
    { type: "application/msword", extension: "doc", icon: <FileText className="h-4 w-4" /> },
    { type: "image/jpeg", extension: "jpg", icon: <Image className="h-4 w-4" alt="" /> },
    { type: "image/png", extension: "png", icon: <Image className="h-4 w-4" alt="" /> },
    { type: "image/tiff", extension: "tiff", icon: <Image className="h-4 w-4" alt="" /> },
  ];

  /**
   * 파일 타입 검증
   */
  const validateFile = useCallback((file: File): boolean => {
    const isValidType = supportedFileTypes.some(
      supportedType => file.type === supportedType.type
    );
    
    if (!isValidType) {
      toast({
        title: "지원되지 않는 파일 형식",
        description: `${file.name}은(는) 지원되지 않는 파일 형식입니다.`,
        variant: "destructive",
      });
      return false;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "파일 크기 초과",
        description: `${file.name}의 크기가 50MB를 초과합니다.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [supportedFileTypes, toast]);

  /**
   * 파일 선택 핸들러
   */
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setShowUploadModal(true);
    }
  }, [validateFile]);

  /**
   * 드래그 앤 드롭 핸들러
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  /**
   * 파일 업로드 핸들러
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await uploadFiles(selectedFiles);
      toast({
        title: "업로드 완료",
        description: `${selectedFiles.length}개 파일이 성공적으로 업로드되었습니다.`,
        variant: "success",
      });
      setSelectedFiles([]);
      setShowUploadModal(false);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 파일 제거 핸들러
   */
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * 파일 타입 아이콘 가져오기
   */
  const getFileIcon = (file: File) => {
    const supportedType = supportedFileTypes.find(type => type.type === file.type);
    return supportedType?.icon || <File className="h-4 w-4" />;
  };

  /**
   * 파일 크기 포맷팅
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Upload className="h-8 w-8" />
                <h2 className="text-3xl font-bold">문서 업로드</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                새로운 문서를 업로드하고 AI 기반 OCR 및 검증 처리를 시작하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="mr-2 h-4 w-4" />
                파일 선택
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 업로드 영역 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            문서 업로드
          </CardTitle>
          <CardDescription>
            드래그 앤 드롭으로 파일을 업로드하거나 파일 선택 버튼을 클릭하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.div
              animate={{ scale: isDragOver ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {isDragOver ? "파일을 여기에 놓으세요" : "파일을 드래그하여 업로드"}
              </h3>
              <p className="text-muted-foreground mb-4">
                또는 파일 선택 버튼을 클릭하여 업로드할 파일을 선택하세요
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                파일 선택
              </Button>
            </motion.div>
          </div>

          {/* 지원되는 파일 형식 */}
          <div className="mt-6 p-4 rounded-2xl bg-muted/30">
            <h4 className="font-medium mb-3">지원되는 파일 형식</h4>
            <div className="flex flex-wrap gap-2">
              {supportedFileTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {type.icon}
                  <span className="ml-1">{type.extension.toUpperCase()}</span>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              최대 파일 크기: 50MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 업로드 상태 표시 */}
      {uploadStatus.length > 0 && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              업로드 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {uploadStatus.map((status, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                          {getFileIcon(status.file)}
                        </div>
                        <div>
                          <h4 className="font-medium">{status.file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(status.file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status.status === "uploading" && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            업로드 중
                          </Badge>
                        )}
                        {status.status === "success" && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            완료
                          </Badge>
                        )}
                        {status.status === "error" && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            오류
                          </Badge>
                        )}
                      </div>
                    </div>

                    {status.status === "uploading" && (
                      <div className="space-y-2">
                        <Progress value={status.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {status.progress}% 완료
                        </p>
                      </div>
                    )}

                    {status.status === "error" && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-red-600">{status.error}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryUpload(index)}
                          className="rounded-xl"
                        >
                          <RefreshCw className="mr-2 h-3 w-3" />
                          재시도
                        </Button>
                      </div>
                    )}

                    {status.status === "success" && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-green-600">업로드 완료</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                          >
                            <Eye className="mr-2 h-3 w-3" />
                            미리보기
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                          >
                            <Download className="mr-2 h-3 w-3" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* 업로드 모달 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              파일 업로드
            </DialogTitle>
            <DialogDescription>
              선택된 파일을 확인하고 업로드를 진행하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                        {getFileIcon(file)}
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFile(index)}
                      className="rounded-xl"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
                className="rounded-2xl"
              >
                취소
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
                className="rounded-2xl"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    업로드 시작
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.tiff"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
