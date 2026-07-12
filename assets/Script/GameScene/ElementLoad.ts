import { _decorator, Component, Node, labelAssembler, Label, Animation } from 'cc';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('ElementLoad')
/**
 * 元素层
 */
export class ElementLoad extends Component {

    //剩余球得文字
    @property({ type: Label })
    private SurpleText: Label | null = null;
    public SurpleNum: number = 0;

    //进球文字
    @property({ type: Label })
    private GoalText: Label | null = null;
    public GoalNum: number = 0;

    //回合提示
    @property({ type: Node })
    private RoundPrompt: Node | null = null;

    //过关提示
    @property({ type: Node })
    public LevelPrompt: Node | null = null;

    start() {

        //动画播放完成事件
        this.RoundPrompt.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this.RoundPrompt.active = false;
        })

        this.LevelPrompt.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            // this.LevelPrompt.active = false;
        })

    }

    update(deltaTime: number) {

    }

    /**
     * 更新关卡信息
     */
    public UpdateLevel() {
        this.GoalNum = 0;
        this.GoalText.string = "进球数量：" + this.GoalNum.toString();
        this.SurpleNum = Global.LevelInfor[Global.NowIndex].surplenum;
        this.SurpleText.string = "剩余球数：" + this.SurpleNum.toString();
        this.LevelPrompt.active = false;
    }

    /**
     * 进球了
     */
    public Goal() {
        this.GoalNum++;
        this.GoalText.string = "进球数量：" + this.GoalNum.toString();
    }

    /**
     * 浪费了一个球
     */
    public Surple() {
        this.SurpleNum--;
        this.SurpleText.string = "剩余球数：" + this.SurpleNum.toString();
    }


    /**
     * 添加回合提示
     * @param 是否进球了
     */
    public AddRoundPrompt(_isgoal: boolean) {
        this.RoundPrompt.active = true;
        this.RoundPrompt.getChildByName("goal").active = _isgoal;
        this.RoundPrompt.getChildByName("kexi").active = !_isgoal;
        this.RoundPrompt.getComponent(Animation).play()
    }

    /**
     * 添加过关提示
     * @param 是否成功过关了
     */
    public AddLevelPrompt(_iswin: boolean) {
        this.LevelPrompt.active = true;
        this.LevelPrompt.getChildByName("gongxi").active = _iswin;
        this.LevelPrompt.getChildByName("fail").active = !_iswin;
        this.LevelPrompt.getComponent(Animation).play();
        //是否显示下一关按钮
        // this.LevelPrompt.getChildByName("NextButton").active = !(Global.NowIndex == Global.LevelInfor.length - 1);
    }
}

