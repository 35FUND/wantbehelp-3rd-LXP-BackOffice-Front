export interface UserProjection {
  email: string;
  nickname: string;
  userRole: "ADMIN" | "USER";
  userStatus: "ACTIVE" | "INACTIVE" | "DELETED";
  updatedAt: string;
}
