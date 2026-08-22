import { User } from "../model/user.model";
import { id } from "../repository/IRepository";
import { getUserRepo, UserRepository } from "../repository/user.Repository";
import { NotFoundException } from "../util/Exception/http/NotFoundException";

export class userServic{
    private userRepo!:UserRepository;


    async getRepo():Promise<UserRepository>{
        if(!this.userRepo){
            this.userRepo=await getUserRepo();
        }
        return this.userRepo;
    }

    async createuser(item:User):Promise<id>{
        const id  = await (await this.getRepo()).create(item);
        return id;
    }
    
     public async validateUser(email:string,password:string):Promise<User>{
            const user = await (await this.getRepo()).findByEmail(email);
            if(!user){
                throw new NotFoundException("User of email " + email + " not found " );
            }
            if(user.password !=password){
                throw new NotFoundException('Invalid password');
            }
            return user;
        }
    public async updateuser(item:User):Promise<void>{
        await (await this.getRepo()).update(item);
    }
}