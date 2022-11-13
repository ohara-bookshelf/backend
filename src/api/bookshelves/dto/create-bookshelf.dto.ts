export class CreateBookshelfDto {
  name: string;
  description: string;
  visible: 'public' | 'private';
}
