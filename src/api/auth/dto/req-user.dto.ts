export type ReqUserDto = {
  id: string;
  sub: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string;
};

export type AuthenticatedDto = {
  user: ReqUserDto;
  access_token: string;
};
