interface Permission {
  action: string;
  subject: string;
}
// if the permission follows the format "action subject
export function mapPermissions(permissions: string[]): Permission[] {
  return permissions
    .map((perm) => {
      const [actionRaw, ...rest] = perm.split(" ");
      const action = actionRaw ?? "";
      const subject = rest.join(" ");
      return { action, subject };
    })
    .filter(({ action, subject }) => action && subject);
}
