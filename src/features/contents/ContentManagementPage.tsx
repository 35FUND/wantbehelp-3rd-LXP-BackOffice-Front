import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Plus, X, Tag, FolderTree } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import {
  addCategory,
  addKeyword,
  deleteCategory,
  deleteKeyword,
  getCategories,
  getKeywords,
} from "../../domain/content/api/contentApi";
import type { CategoryItem, KeywordItem } from "../../domain/content/model/contentTypes";

export default function ContentManagementPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [categoryData, keywordData] = await Promise.all([getCategories(), getKeywords()]);
        setCategories(categoryData);
        setKeywords(keywordData);
      } catch {
        setFeedbackMessage("목록 조회에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const reloadLists = async () => {
    const [categoryData, keywordData] = await Promise.all([getCategories(), getKeywords()]);
    setCategories(categoryData);
    setKeywords(keywordData);
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      await addCategory(trimmed);
      await reloadLists();
      setNewCategory("");
      setFeedbackMessage("카테고리가 DB에 반영되었습니다.");
    } catch {
      setFeedbackMessage("카테고리 저장에 실패했습니다. 중복 여부를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (item: CategoryItem) => {
    try {
      setIsSubmitting(true);
      await deleteCategory(item.id);
      await reloadLists();
      setFeedbackMessage("카테고리가 DB에서 삭제되었습니다.");
    } catch {
      setFeedbackMessage("카테고리 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKeyword = async () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      await addKeyword(trimmed);
      await reloadLists();
      setNewKeyword("");
      setFeedbackMessage("키워드가 DB에 반영되었습니다.");
    } catch {
      setFeedbackMessage("키워드 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKeyword = async (item: KeywordItem) => {
    try {
      setIsSubmitting(true);
      await deleteKeyword(item.id);
      await reloadLists();
      setFeedbackMessage("키워드가 DB에서 삭제되었습니다.");
    } catch {
      setFeedbackMessage("키워드 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-gray-900">콘텐츠 관리</h1>
        <p className="text-body-reg text-gray-500 mt-2">카테고리와 추천 검색어(키워드)를 관리합니다.</p>
        {feedbackMessage ? <p className="text-body-sm text-primary mt-2">{feedbackMessage}</p> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FolderTree className="w-5 h-5 text-primary" />
              <CardTitle>카테고리 관리</CardTitle>
            </div>
            <p className="text-body-sm text-gray-500">메인 화면에 노출될 카테고리 목록입니다.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="새 카테고리 입력..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                disabled={isSubmitting}
              />
              <Button onClick={handleAddCategory} disabled={!newCategory.trim() || isSubmitting}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="p-3 text-sm text-gray-500">로딩 중...</div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100 group hover:bg-white hover:shadow-sm transition-all"
                  >
                    <span className="text-gray-900 font-medium">{category.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      disabled={isSubmitting}
                      className="text-gray-400 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-secondary" />
              <CardTitle>키워드 관리</CardTitle>
            </div>
            <p className="text-body-sm text-gray-500">검색 및 필터링에 사용될 추천 키워드입니다.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="새 키워드 입력..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                disabled={isSubmitting}
              />
              <Button onClick={handleAddKeyword} variant="secondary" disabled={!newKeyword.trim() || isSubmitting}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {isLoading ? (
                <div className="text-sm text-gray-500">로딩 중...</div>
              ) : (
                keywords.map((keyword) => (
                  <Badge
                    key={keyword.id}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm flex items-center space-x-1 hover:bg-gray-200 cursor-default"
                  >
                    <span># {keyword.name}</span>
                    <button
                      onClick={() => handleDeleteKeyword(keyword)}
                      disabled={isSubmitting}
                      className="ml-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
