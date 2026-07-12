import { _decorator, Component, Node, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FixLoad')
/**
 * 固定层
 * 发球人 守门员 球
 */
export class FixLoad extends Component {

    //防守者
    @property({ type: Node })
    private GoalKeeper: Node | null = null;

    //足球
    @property({ type: Node })
    private Ball: Node | null = null;

    //球门效果
    @property(Node)
    private Effect: Node | null = null;

    //守门员移动速度
    private FixSpeed: number = 5;
    private MoveSpeed: number = 0;

    //守门移动得距离边界
    private MoveDis: { min: number, max: number } = { min: -166, max: 166 }

    //守门员的初始位置
    private StarPos: Vec3 = new Vec3(0, -470, 0);

    start() {

    }

    update(deltaTime: number) {
        let keeper_pos: Vec3 = this.GoalKeeper.getPosition();
        keeper_pos.add(new Vec3(this.MoveSpeed, 0, 0))

        if (keeper_pos.x <= this.MoveDis.min) {//守门员移动到了最左侧
            this.MoveSpeed = this.FixSpeed;
        }

        if (keeper_pos.x >= this.MoveDis.max) {//守门员移动到了最右侧
            this.MoveSpeed = -this.FixSpeed;
        }

        this.GoalKeeper.setPosition(keeper_pos);
    }

    /**
     * 更新关卡信息
     */
    public UpdateLevel() {
        this.GoalKeeper.setPosition(this.StarPos);
        this.MoveSpeed = this.FixSpeed;
    }

    /**
     * 播放球门动画
     */
    public PlayGolaAni() {
        this.Effect.getComponent(Animation).play();
    }
}

