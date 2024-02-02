import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {Application} from 'express';

import {IAdminApplicationRepository} from '../../domain/model/admin/IAdminRepository';

import Logger from '../logger/logger';
import Admin from '../../domain/model/admin/admin';
import crypt from './crypt';

const logger = new Logger('passport');

export default function passportSetting(app: Application, adminRepository: IAdminApplicationRepository): void {
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
  }, async (id, pw, done) => {
    try {
      const admin = await adminRepository.findById(id);

      if (!admin) return done(null, false, {message: 'ユーザーが見つかりません。'});

      if (!crypt.compare(pw, admin.Pw)) return done(null, false, {message: 'パスワードが違います。'});

      return done(null, admin);
    } catch (err) {
      return done(err, false, {message: '認証に失敗しました。'});
    }
  }));

  passport.serializeUser((admin, done) => {
    logger.debug('serializeUser');
    done(null, admin);
  });

  passport.deserializeUser((loginUser, done) => {
    const user = loginUser as {
      id: string,
      pw: string,
    };

    const admin = new Admin(user.id, user.pw);
    adminRepository.findById(admin.Id).then((admin) => {
      if (!admin) throw new Error('認証失敗');

      logger.debug('認証成功');
      done(null, admin);
    }).catch((err) => {
      logger.debug('認証失敗');
      done(err, null);
    });
  });

  app.use(passport.session());

  app.use(passport.initialize());
}
