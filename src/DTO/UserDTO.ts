import { Role } from './../enums/roles';
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type UserFirestoreDTO =  {
  userId: string,
  role: Role,
  createdAt: string,
  deviceToken: string
}