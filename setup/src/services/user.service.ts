import { User } from "../model/user.model";
import { id } from "../repository/IRepository";
import { getUserRepo, UserRepository } from "../repository/user.Repository";
import { NotFoundException } from "../util/Exception/http/NotFoundException";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export class userServic{
    private userRepo!:UserRepository;


    async getRepo():Promise<UserRepository>{
        if(!this.userRepo){
            this.userRepo=await getUserRepo();
        }
        return this.userRepo;
    }

     async createuser(item:User):Promise<id>{
        // hash the plaintext password before it ever reaches the DB
        item.password = await bcrypt.hash(item.password, SALT_ROUNDS);
        const id  = await (await this.getRepo()).create(item);
        return id;
    }
    
      public async validateUser(email:string,password:string):Promise<User>{
            const user = await (await this.getRepo()).findByEmail(email);
            if(!user){
                throw new NotFoundException("User of email " + email + " not found " );
            }
            const passwordMatches = await bcrypt.compare(password, user.password);
            if(!passwordMatches){
                throw new NotFoundException('Invalid password');
            }
            return user;
        }
    public async updateuser(item:User):Promise<void>{
        // re-hash if the caller passed a new plaintext password
        if(item.password && !item.password.startsWith("$2")){
            item.password = await bcrypt.hash(item.password, SALT_ROUNDS);
        }
        await (await this.getRepo()).update(item);
    }

    public async getUserById(id:id):Promise<User>{
        return await (await this.getRepo()).get(id);//  and the code will be writing in the backend of thhe devops evgeneering and  
    }
}