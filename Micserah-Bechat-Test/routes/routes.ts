import express, {Request, Response} from 'express';
const router = express.Router();
import { RegisterUser, LoginUser, profile, getUser, getUsers, updateUser, deleteUser, userAuth } from '../controller/usercontroller';
import { CreatePost, getPost, getPosts, updatePost, deletePost } from '../controller/postcontroller';


router
.route('/sign-up')
.post(RegisterUser);

router
.route('/sign-in')
.post(LoginUser);

router
.get('/profile', userAuth, async(req: Request, res: Response) => {
    return res.json(profile(req.user));
});

router
.route('/user/:username')
.get(userAuth, getUser);

router
.route('/users')
.get(userAuth, getUsers);

router
.route('/user/update')
.patch(userAuth, async(req: Request, res: Response) => {
    await updateUser(req.user, req, res)
});

router
.route('/user/delete')
.delete(userAuth, async(req: Request, res: Response)=>{
    await deleteUser(req.user, req, res)
});

router
.route('/user/post')
.post(userAuth, async(req: Request, res: Response)=>{
    await CreatePost(req.user, req, res)
});

router
.route('/user/post/:id')
.get(userAuth, getPost)
.patch(userAuth, async(req: Request, res: Response)=>{
    await updatePost(req.user, req, res)
})
.delete(userAuth, async(req: Request, res: Response)=>{
    await deletePost(req.user, req, res)
});

router
.route('/users/posts')
.get(userAuth, getPosts);

export default router;


