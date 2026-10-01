// Pages published from this browser (MVP "account" without login)
export type MyPage = {
  slug: string;
  url: string;
  title: string;
  occasion: string;
  templateId: string;
  createdAt: string;
};

const KEY = "occasion:my-pages";

export function getMyPages(): MyPage[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addMyPage(page: MyPage) {
  try {
    localStorage.setItem(KEY, JSON.stringify([page, ...getMyPages().filter((p) => p.slug !== page.slug)]));
  } catch {}
}

export function removeMyPage(slug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(getMyPages().filter((p) => p.slug !== slug)));
  } catch {}
}
