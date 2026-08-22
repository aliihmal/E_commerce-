import { toRole } from "../config/role";
import { userBuilder } from "../model/builder/user.builder";
import { User } from "../model/user.model";
import { IMapper } from "./IMapper";

export interface userRow{
    id :string;
    name :string;
    email :string;
    password:string;
    role :string;
    phone:string;
}

export class userMapper implements IMapper<userRow,User>{
    map(data: userRow): User {
      
        return  userBuilder.newUserBuilder().setId(data.id).setName(data.name)
        .setEmail(data.email).setPassowrd(data.password).setRole(toRole(data.role)).setPhone(data.phone).build();
    }
    reverseMap(data: User): userRow {
        throw new Error("Method not implemented.");
    }
    
}