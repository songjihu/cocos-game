import { _decorator, Component, Node, Prefab, Vec3, instantiate, Vec2 } from 'cc';
import { Global } from '../../Global';
import { Defense } from './Defense';
const { ccclass, property } = _decorator;

@ccclass('DefenseLoad')
/**
 * 防守者层
 */
export class DefenseLoad extends Component {

    //我方球员预设体
    @property({ type: Prefab })
    private Defense: Prefab | null = null;

    //球员数组
    private Defenses: Node[] = [];

    start() {

    }


    /**
    * 获取球员
    * @param 位置
    */
    public GetDenfense(_pos: Vec3) {
        if (this.Defenses.length == 0) {
            this.CreateDenfense(_pos);
        } else {
            let use_num: number = -1;
            for (let i = 0; i < this.Defenses.length; i++) {
                if (this.Defenses[i].active == false) use_num = i;
            }
            if (use_num == -1) this.CreateDenfense(_pos);
            else {
                this.Defenses[use_num].getComponent(Defense).UpdateStyle();
                this.Defenses[use_num].setPosition(_pos);
            }
        }
    }

    /**
     * 创建球员
     * @param 位置
     */
    private CreateDenfense(_pos: Vec3) {
        let denfense: Node = instantiate(this.Defense);
        this.node.addChild(denfense);
        denfense.setPosition(_pos);
        denfense.getComponent(Defense).UpdateStyle();
        this.Defenses.push(denfense);
    }

    /**
     * 更新关卡
     */
    public UpdateLevel() {
        for (let i = 0; i < this.Defenses.length; i++) { this.Defenses[i].active = false }

        for (let i = 0; i < Global.LevelInfor[Global.NowIndex].denfense.length; i++) {
            this.GetDenfense(new Vec3(Global.LevelInfor[Global.NowIndex].denfense[i].x, Global.LevelInfor[Global.NowIndex].denfense[i].y, 0))
        }
    }
}

