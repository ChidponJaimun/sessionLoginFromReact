import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

LocalStrategy.Strategy

function initialize(passport,getUserbyUsername){
  const authenticateUser = async (username,password,done)=>{
    const user = getUserbyUsername(username)
    if (user == null){
      return done(null,false,{message : "No user found"});
    }
    try {
      if(await bcrypt.compare(password,user.password)){
          return done(null,user);
      }else {
            return done(null,false,{message : "Password incorrect"});
      }
    }catch(e){
      return done (e)
    }
  }
 passport.use(new LocalStrategy ({usernameField:'username'},authenticateUser))
 passport.serializeUser((user,done)=>{});
 passport.deserializeUser((id,done)=>{});
}

export default initialize;
