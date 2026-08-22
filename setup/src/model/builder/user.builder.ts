import { ROLE } from "../../config/role";
import { User } from "../user.model";

export class userBuilder{
    id!:string;
    name!:string;
    email!:string;
    password!:string;
    role!:ROLE;
    phone!:string;

    public static newUserBuilder():userBuilder{
        return new userBuilder();
    }

    setPhone(phone:string):userBuilder{
        this.phone=phone;
        return this;
    }
    setRole(role:ROLE):userBuilder{
        this.role=role;
        return this;
    }
    setPassowrd(password:string):userBuilder{
        this.password=password;
        return this;
    }

    setEmail(email:string):userBuilder{
        this.email=email;
        return this;
    }
    setName(name:string):userBuilder{
        this.name=name;
        return this;
    }

    setId(id:string):userBuilder{
        this.id=id;
        return this;
    }

    build():User{
        if(!this.id || !this.name || !this.email || !this.password || !this.role || !this.phone){
            throw new Error("Error while building the user class");
        }
        return new User(this.id,this.name,this.email,this.password,this.role,this.phone);
    }
}