import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, Contact2DType, Collider2D, IPhysics2DContact, Vec2, Game, Animation, } from 'cc';
import { Defense } from '../GameScene/DefenseLoad/Defense';
import { Ball } from '../GameScene/FixLoad/Ball';
import { Mycontrol } from '../GameScene/MycontrolLoad/Mycontrol';
import { Global } from '../Global';
import { GameScene } from '../Scene/GameScene';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('PhysicsMgr')
/**
 * 物理管理
 */
export class PhysicsMgr extends Component {
    //
    private static _instance: PhysicsMgr = null;
    //
    public static get instance() {
        if (!this._instance) {
            this._instance = new PhysicsMgr();
        }
        return this._instance;
    }

    /**
     * 初始化
     */
    public Init() {
        // Global.IsDebug && this.DrawDebug();
        // //可编辑器设置
        // PhysicsSystem2D.instance.fixedTimeStep = 1 / 30;
        // PhysicsSystem2D.instance.velocityIterations = 10;
        // PhysicsSystem2D.instance.positionIterations = 10;
        this.AddEvent();
    }

    /**
     * 绘制调试信息
     */
    private DrawDebug() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    }

    /**
     * 全局添加碰撞回调事件
     */
    private AddEvent() {
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.BeginContact, this);
        // PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.EndContact, this);
        // PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.PreSolve, this);
        // PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.PostSolve, this);
    }

    /**
     * 刚开始碰撞回调
     * @param 碰撞体1
     * @param 碰撞体2
     * @param 碰撞信息
     */
    private BeginContact(_selfCollider: Collider2D, _otherCollider: Collider2D, _contact: IPhysics2DContact | null) {

        //根据情况确认碰撞体
        let ball_collider: Collider2D = _otherCollider.node.name === Global.HitBodyName.Ball ? _otherCollider : _selfCollider;
        let else_collider: Collider2D = _otherCollider.node.name === Global.HitBodyName.Ball ? _selfCollider : _otherCollider;
        switch (else_collider.node.name) {
            case Global.HitBodyName.GoalHit:
                setTimeout(() => {
                    GameScene.instance.ResetRound(true);
                }, 10);
                break;
            case Global.HitBodyName.NoGoal0:
                setTimeout(() => {
                    GameScene.instance.ResetRound(false);
                }, 10);
                break;
            case Global.HitBodyName.NoGoal1:
                setTimeout(() => {
                    GameScene.instance.ResetRound(false);
                }, 10);
                break;
            case Global.HitBodyName.Mycontrol:
                Global.IsDebug && console.log("碰到了发球人,发球人开始转动")
                //足球暂时消失
                //需要延时处理，否则报错
                setTimeout(() => {
                    ball_collider.body.type = 0;
                    ball_collider.node.getComponent(Ball).ShowBall(false);
                    //
                    GameScene.instance.ControlPeople = else_collider.node;
                    GameScene.instance.ControlPeople.getComponent(Mycontrol).HitBall();

                }, 10);
                break;
            case Global.HitBodyName.Denfense:
                Global.IsDebug && console.log("碰到了防守者,播放动画")
                setTimeout(() => {
                    AudioMgr.instance.PlayEffect("hit")
                    else_collider.node.getComponent(Defense).PlayAnimate();
                }, 10);

            case Global.HitBodyName.GoalKeeper:
                Global.IsDebug && console.log("碰到了防守者,播放动画")
                AudioMgr.instance.PlayEffect("hit")
                else_collider.node.getComponent(Animation).play();
                break;
        }

    }


    /**
     * 两个物体结束碰撞回调
     * @param 碰撞体1
     * @param 碰撞体2
     * @param 碰撞信息
     */
    private EndContact(_selfCollider: Collider2D, _otherCollider: Collider2D, _contact: IPhysics2DContact | null) {

    }

    /**
     * 每次将要处理碰撞体接触逻辑时被调用
     * @param 碰撞体1
     * @param 碰撞体2
     * @param 碰撞信息
     */
    private PreSolve(_selfCollider: Collider2D, _otherCollider: Collider2D, _contact: IPhysics2DContact | null) {

    }

    /**
     * 每次处理完碰撞体接触逻辑时被调用
     * @param 碰撞体1
     * @param 碰撞体2
     * @param 碰撞信息
     */
    private PostSolve(_selfCollider: Collider2D, _otherCollider: Collider2D, _contact: IPhysics2DContact | null) {

    }


}

