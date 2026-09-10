/** Path to open right after a successful login/register. */
export function getPostAuthPath(user: { is_admin?: boolean | null } | null | undefined): string {
  return user?.is_admin === true ? "/admin" : "/app/journals"
}

/** Hard navigation avoids React Router races with PublicOnlyRoute after setUser. */
export function goPostAuth(user: { is_admin?: boolean | null } | null | undefined): void {
  window.location.replace(getPostAuthPath(user))
}
