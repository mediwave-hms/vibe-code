import { Permission, Role } from '../types/enums';
import { User } from '../types/models';
import { ROLE_PERMISSIONS } from '../data/constants';
import { useStore } from '../store';

export function can(permission: Permission, user?: User | null): boolean {
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function roleHas(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function usePermission() {
  const user = useStore((state) => state.currentUser);

  return {
    can: (permission: Permission) => can(permission, user),
    roleHas,
    user,
  };
}

export default usePermission;
