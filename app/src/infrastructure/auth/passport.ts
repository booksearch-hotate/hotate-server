import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";

import {Application} from "express";

import Logger from "../logger/logger";
import crypt from "./crypt";
import User from "../../domain/model/user/user";
import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";

const logger = new Logger("passport");

export default function passportSetting(app: Application, userRepository: IUserDBRepository): void {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
  }, async (email, password, done) => {
    try {
      const user = await userRepository.findByEmail(email);

      if (!user) return done(null, false, {message: "ユーザーが見つかりません。"});

      if (!crypt.compare(password, user.Password)) return done(null, false, {message: "パスワードが違います。"});

      return done(null, user, {message: "ログインに成功しました。"});
    } catch (err) {
      return done(err, false, {message: "認証に失敗しました。"});
    }
  }));

  passport.serializeUser((user, done) => {
    logger.debug("serializeUser");
    done(null, user);
  });

  passport.deserializeUser((loginUser, done) => {
    const userObj = loginUser as {
      id: number,
      email: string,
      password: string,
      role: "user" | "admin",
    };

    const user = new User(userObj.id, userObj.email, userObj.password, userObj.role, null);
    userRepository.findByEmail(user.Email).then((user) => {
      if (!user) throw new Error("認証失敗");
      done(null, user);
    }).catch((err) => {
      done(err, null);
    });
  });

  app.use(passport.session());

  app.use(passport.initialize());
}
