
(function(){
"use strict";
/* ======================== data.js ======================== */
const CHARACTERS = [{"n":1,"name":"宋江","nick":"呼保义","star":"天魁星","bio":"梁山泊首领，善于笼络人心并主张招安；征方腊后受封，最终被朝廷赐下毒酒身亡。","kind":"hero","tier":"天罡"},{"n":2,"name":"卢俊义","nick":"玉麒麟","star":"天罡星","bio":"武艺高强、棍棒天下无双的北京富户，受计上梁山；征方腊后被奸臣毒害，落水而亡。","kind":"hero","tier":"天罡"},{"n":3,"name":"吴用","nick":"智多星","star":"天机星","bio":"梁山军师，足智多谋，多次策划关键行动；宋江死后与花荣在其墓前自缢。","kind":"hero","tier":"天罡"},{"n":4,"name":"公孙胜","nick":"入云龙","star":"天闲星","bio":"精通道术的梁山军师，号一清道人；征辽后辞别梁山，回二仙山随罗真人修道。","kind":"hero","tier":"天罡"},{"n":5,"name":"关胜","nick":"大刀","star":"天勇星","bio":"关羽后人，善使青龙偃月刀，归顺后位列五虎将；受封后因醉酒坠马，伤重身亡。","kind":"hero","tier":"天罡"},{"n":6,"name":"林冲","nick":"豹子头","star":"天雄星","bio":"原为八十万禁军教头，遭高俅陷害后雪夜上梁山；征方腊后中风病重，在杭州病逝。","kind":"hero","tier":"天罡"},{"n":7,"name":"秦明","nick":"霹雳火","star":"天猛星","bio":"性烈如火、善使狼牙棒的五虎将；征方腊攻打清溪时与方杰交战，阵亡沙场。","kind":"hero","tier":"天罡"},{"n":8,"name":"呼延灼","nick":"双鞭","star":"天威星","bio":"名将之后，擅使双鞭并统领连环马；征方腊后受封御营兵马指挥使。","kind":"hero","tier":"天罡"},{"n":9,"name":"花荣","nick":"小李广","star":"天英星","bio":"箭术超群，有“小李广”之称；征方腊后随军受封，宋江死后与吴用在其墓前自缢。","kind":"hero","tier":"天罡"},{"n":10,"name":"柴进","nick":"小旋风","star":"天贵星","bio":"后周皇族后裔，仗义疏财，曾庇护众多好汉；征方腊后辞官归乡，得以善终。","kind":"hero","tier":"天罡"},{"n":11,"name":"李应","nick":"扑天雕","star":"天富星","bio":"李家庄庄主，善使飞刀，人称扑天雕；征方腊后受封，随后辞官返乡，安享富贵。","kind":"hero","tier":"天罡"},{"n":12,"name":"朱仝","nick":"美髯公","star":"天满星","bio":"原为郓城县都头，重义疏财，因私放雷横获罪；征方腊后受封保定府都统制。","kind":"hero","tier":"天罡"},{"n":13,"name":"鲁智深","nick":"花和尚","star":"天孤星","bio":"性情豪爽、嫉恶如仇，拳打镇关西后出家；征方腊后在杭州听潮信圆寂。","kind":"hero","tier":"天罡"},{"n":14,"name":"武松","nick":"行者","star":"天伤星","bio":"景阳冈打虎英雄，快意恩仇，血溅鸳鸯楼后落草；征方腊失去左臂，后于六和寺善终。","kind":"hero","tier":"天罡"},{"n":15,"name":"董平","nick":"双枪将","star":"天立星","bio":"善使双枪的风流将军，位列梁山五虎将；征方腊攻打独松关时战死。","kind":"hero","tier":"天罡"},{"n":16,"name":"张清","nick":"没羽箭","star":"天捷星","bio":"擅用飞石连打梁山群雄，归顺后屡立战功；征方腊攻打独松关时战死。","kind":"hero","tier":"天罡"},{"n":17,"name":"杨志","nick":"青面兽","star":"天暗星","bio":"杨家将后人，因脸有青记得名青面兽；征方腊途中染病，最终病逝于丹徒。","kind":"hero","tier":"天罡"},{"n":18,"name":"徐宁","nick":"金枪手","star":"天佑星","bio":"禁军金枪班教师，精通钩镰枪法并大破连环马；征方腊时中毒箭，伤重身亡。","kind":"hero","tier":"天罡"},{"n":19,"name":"索超","nick":"急先锋","star":"天空星","bio":"性情急躁、惯使金蘸斧的猛将；征方腊攻打杭州时被石宝以流星锤击杀。","kind":"hero","tier":"天罡"},{"n":20,"name":"戴宗","nick":"神行太保","star":"天速星","bio":"能日行八百里的神行太保，掌管梁山机密传递；征方腊后辞官，在岳庙出家并善终。","kind":"hero","tier":"天罡"},{"n":21,"name":"刘唐","nick":"赤发鬼","star":"天异星","bio":"赤发紫黑、勇猛善战，是智取生辰纲的参与者；征方腊攻打杭州时被闸门压死。","kind":"hero","tier":"天罡"},{"n":22,"name":"李逵","nick":"黑旋风","star":"天杀星","bio":"性情鲁莽却忠于宋江，惯使两把板斧；宋江饮下毒酒后怕他造反，将其一并毒死。","kind":"hero","tier":"天罡"},{"n":23,"name":"史进","nick":"九纹龙","star":"天微星","bio":"身刺九条青龙，师从王进，少年意气豪迈；征方腊攻打昱岭关时中箭阵亡。","kind":"hero","tier":"天罡"},{"n":24,"name":"穆弘","nick":"没遮拦","star":"天究星","bio":"揭阳镇富户出身，武艺高强且无人敢挡；征方腊期间染病，留在杭州后病逝。","kind":"hero","tier":"天罡"},{"n":25,"name":"雷横","nick":"插翅虎","star":"天退星","bio":"原为郓城县步兵都头，膂力过人；征方腊攻打德清时与敌将交战，阵亡沙场。","kind":"hero","tier":"天罡"},{"n":26,"name":"李俊","nick":"混江龙","star":"天寿星","bio":"水性卓绝、颇有首领才略的水军头领；征方腊后远航海外，最终在暹罗称王。","kind":"hero","tier":"天罡"},{"n":27,"name":"阮小二","nick":"立地太岁","star":"天剑星","bio":"石碣村阮氏三雄之长，精熟水战；征方腊乌龙岭兵败被围，为免受辱自刎。","kind":"hero","tier":"天罡"},{"n":28,"name":"张横","nick":"船火儿","star":"天平星","bio":"浔阳江上的船家，水性出众；征方腊期间染病留在杭州，最终病逝。","kind":"hero","tier":"天罡"},{"n":29,"name":"阮小五","nick":"短命二郎","star":"天罪星","bio":"阮氏三雄之一，性情刚烈、善于水战；征方腊攻打清溪时战死。","kind":"hero","tier":"天罡"},{"n":30,"name":"张顺","nick":"浪里白条","star":"天损星","bio":"水性极佳，能在水下潜行，人称浪里白条；征方腊攻打杭州时在涌金门外中箭溺亡。","kind":"hero","tier":"天罡"},{"n":31,"name":"阮小七","nick":"活阎罗","star":"天败星","bio":"阮氏三雄中最年幼，率真不羁、精通水战；征方腊后被削官返乡，活到六十岁善终。","kind":"hero","tier":"天罡"},{"n":32,"name":"杨雄","nick":"病关索","star":"天牢星","bio":"蓟州刽子手出身，武艺不俗；征方腊后返京途中患病，留在杭州病逝。","kind":"hero","tier":"天罡"},{"n":33,"name":"石秀","nick":"拼命三郎","star":"天慧星","bio":"性情刚烈、路见不平便舍命相助，人称拼命三郎；征方腊攻打昱岭关时中箭阵亡。","kind":"hero","tier":"天罡"},{"n":34,"name":"解珍","nick":"两头蛇","star":"天暴星","bio":"登州猎户，擅长穿山越岭，与解宝为兄弟；征方腊攻打乌龙岭时坠崖身亡。","kind":"hero","tier":"天罡"},{"n":35,"name":"解宝","nick":"双尾蝎","star":"天哭星","bio":"登州猎户，勇猛敏捷，与解珍并称猎户双雄；征方腊攻打乌龙岭时坠崖身亡。","kind":"hero","tier":"天罡"},{"n":36,"name":"燕青","nick":"浪子","star":"天巧星","bio":"卢俊义心腹，精通相扑、吹箫和弩箭，机敏多才；征方腊后悄然离队，从此归隐江湖。","kind":"hero","tier":"天罡"},{"n":37,"name":"朱武","nick":"神机军师","star":"地魁星","bio":"精通阵法的少华山军师，负责梁山军务谋划；征方腊后与樊瑞投公孙胜修道。","kind":"hero","tier":"地煞"},{"n":38,"name":"黄信","nick":"镇三山","star":"地煞星","bio":"原为青州兵马都监，使一柄丧门剑；征方腊后受封，仍回青州任职。","kind":"hero","tier":"地煞"},{"n":39,"name":"孙立","nick":"病尉迟","star":"地勇星","bio":"登州提辖，枪鞭并用，曾卧底祝家庄；征方腊后受封，回登州任职。","kind":"hero","tier":"地煞"},{"n":40,"name":"宣赞","nick":"丑郡马","star":"地杰星","bio":"郡马出身，善使钢刀，奉命举荐关胜征梁山；征方腊攻打苏州时战死。","kind":"hero","tier":"地煞"},{"n":41,"name":"郝思文","nick":"井木犴","star":"地雄星","bio":"关胜结义兄弟，武艺出众，人称井木犴；征方腊攻打杭州时被俘，惨遭杀害。","kind":"hero","tier":"地煞"},{"n":42,"name":"韩滔","nick":"百胜将","star":"地威星","bio":"陈州团练使出身，善使枣木槊；征方腊攻打常州时中箭阵亡。","kind":"hero","tier":"地煞"},{"n":43,"name":"彭玘","nick":"天目将","star":"地英星","bio":"颍州团练使出身，善使三尖两刃刀；征方腊攻打常州时战死。","kind":"hero","tier":"地煞"},{"n":44,"name":"单廷珪","nick":"圣水将","star":"地奇星","bio":"凌州团练使，擅长水攻，人称圣水将；征方腊攻打歙州时战死。","kind":"hero","tier":"地煞"},{"n":45,"name":"魏定国","nick":"神火将","star":"地猛星","bio":"凌州团练使，擅长火攻，人称神火将；征方腊攻打歙州时战死。","kind":"hero","tier":"地煞"},{"n":46,"name":"萧让","nick":"圣手书生","star":"地文星","bio":"书法名家，善仿苏、黄、米、蔡诸体，负责梁山文书；招安后被蔡京留用，免于征方腊。","kind":"hero","tier":"地煞"},{"n":47,"name":"裴宣","nick":"铁面孔目","star":"地正星","bio":"原为孔目，刚正严明，掌管梁山军政赏罚；征方腊后受封，随后返回饮马川。","kind":"hero","tier":"地煞"},{"n":48,"name":"欧鹏","nick":"摩云金翅","star":"地阔星","bio":"军户出身，身手矫健，人称摩云金翅；征方腊攻打歙州时中箭阵亡。","kind":"hero","tier":"地煞"},{"n":49,"name":"邓飞","nick":"火眼狻猊","star":"地阖星","bio":"饮马川头领，双眼赤红，惯使铁链；征方腊攻打杭州时被石宝斩杀。","kind":"hero","tier":"地煞"},{"n":50,"name":"燕顺","nick":"锦毛虎","star":"地强星","bio":"清风山头领，膂力过人，性情凶悍；征方腊攻打乌龙岭时被石宝斩杀。","kind":"hero","tier":"地煞"},{"n":51,"name":"杨林","nick":"锦豹子","star":"地暗星","bio":"四处闯荡的绿林好汉，善使笔管枪；征方腊后受封，随后与裴宣返回饮马川。","kind":"hero","tier":"地煞"},{"n":52,"name":"凌振","nick":"轰天雷","star":"地轴星","bio":"宋朝著名炮手，精于制造和使用火炮；征方腊后受封，进入朝廷火药局任职。","kind":"hero","tier":"地煞"},{"n":53,"name":"蒋敬","nick":"神算子","star":"地会星","bio":"精于书算，负责梁山钱粮收支；征方腊后受封，辞官返回潭州故乡。","kind":"hero","tier":"地煞"},{"n":54,"name":"吕方","nick":"小温侯","star":"地佐星","bio":"善使方天画戟，常与郭盛并肩作战；征方腊攻打乌龙岭时与敌将同坠山崖身亡。","kind":"hero","tier":"地煞"},{"n":55,"name":"郭盛","nick":"赛仁贵","star":"地佑星","bio":"善使方天画戟，因比武结识吕方；征方腊攻打乌龙岭时被巨石砸死。","kind":"hero","tier":"地煞"},{"n":56,"name":"安道全","nick":"神医","star":"地灵星","bio":"医术高明，曾治好宋江背疮，负责梁山医疗；征方腊前被召入宫中任御医，得以善终。","kind":"hero","tier":"地煞"},{"n":57,"name":"皇甫端","nick":"紫髯伯","star":"地兽星","bio":"精通相马和兽医之术，掌管梁山马匹；征方腊前被留在京城任御马监，得以善终。","kind":"hero","tier":"地煞"},{"n":58,"name":"王英","nick":"矮脚虎","star":"地微星","bio":"身材矮小、善使长枪的清风山头领；征方腊攻打睦州时战死。","kind":"hero","tier":"地煞"},{"n":59,"name":"扈三娘","nick":"一丈青","star":"地慧星","bio":"武艺高强、善使日月双刀的女将，后嫁王英；征方腊攻打睦州时为救夫阵亡。","kind":"hero","tier":"地煞"},{"n":60,"name":"鲍旭","nick":"丧门神","star":"地暴星","bio":"性情嗜杀、惯使阔剑，率领步军冲锋陷阵；征方腊攻打杭州时被石宝斩杀。","kind":"hero","tier":"地煞"},{"n":61,"name":"樊瑞","nick":"混世魔王","star":"地然星","bio":"芒砀山首领，精通法术，人称混世魔王；征方腊后与朱武投公孙胜修道。","kind":"hero","tier":"地煞"},{"n":62,"name":"孔明","nick":"毛头星","star":"地猖星","bio":"孔家庄少庄主，曾随宋江学习武艺；征方腊期间染病，留在杭州后病逝。","kind":"hero","tier":"地煞"},{"n":63,"name":"孔亮","nick":"独火星","star":"地狂星","bio":"孔明之弟，曾随宋江学习武艺；征方腊攻打昆山时落水身亡。","kind":"hero","tier":"地煞"},{"n":64,"name":"项充","nick":"八臂哪吒","star":"地飞星","bio":"善使团牌、标枪和飞刀，常为步军开路；征方腊攻打睦州时陷入敌阵，战死。","kind":"hero","tier":"地煞"},{"n":65,"name":"李衮","nick":"飞天大圣","star":"地走星","bio":"善使团牌、标枪和宝剑，与项充并肩冲锋；征方腊攻打睦州时中箭身亡。","kind":"hero","tier":"地煞"},{"n":66,"name":"金大坚","nick":"玉臂匠","star":"地巧星","bio":"石刻名家，善刻碑文印信，负责梁山符印；征方腊前被留在京城御前听用。","kind":"hero","tier":"地煞"},{"n":67,"name":"马麟","nick":"铁笛仙","star":"地明星","bio":"善使双刀又精通铁笛，原为黄门山头领；征方腊攻打乌龙岭时战死。","kind":"hero","tier":"地煞"},{"n":68,"name":"童威","nick":"出洞蛟","star":"地进星","bio":"浔阳江船家，熟悉水路，是李俊的得力助手；征方腊后随李俊远航海外，在暹罗立业。","kind":"hero","tier":"地煞"},{"n":69,"name":"童猛","nick":"翻江蜃","star":"地退星","bio":"童威之弟，水性出众，长期追随李俊；征方腊后随李俊远航海外，在暹罗立业。","kind":"hero","tier":"地煞"},{"n":70,"name":"孟康","nick":"玉幡竿","star":"地满星","bio":"身材高瘦、擅长造船，负责梁山战船建造；征方腊攻打乌龙岭时中炮身亡。","kind":"hero","tier":"地煞"},{"n":71,"name":"侯健","nick":"通臂猿","star":"地遂星","bio":"裁缝出身，善制旗袍旌帜，负责梁山衣甲旗号；征方腊攻打杭州途中船毁落水而亡。","kind":"hero","tier":"地煞"},{"n":72,"name":"陈达","nick":"跳涧虎","star":"地周星","bio":"少华山头领，善使出白点钢枪；征方腊攻打昱岭关时中箭阵亡。","kind":"hero","tier":"地煞"},{"n":73,"name":"杨春","nick":"白花蛇","star":"地隐星","bio":"少华山头领，善使大杆刀；征方腊攻打昱岭关时中箭阵亡。","kind":"hero","tier":"地煞"},{"n":74,"name":"郑天寿","nick":"白面郎君","star":"地异星","bio":"清风山头领，容貌白净俊秀，善使钢叉；征方腊攻打宣州时被城上飞石击中身亡。","kind":"hero","tier":"地煞"},{"n":75,"name":"陶宗旺","nick":"九尾龟","star":"地理星","bio":"庄户出身、力气过人，负责梁山城垣修筑；征方腊攻打润州时战死。","kind":"hero","tier":"地煞"},{"n":76,"name":"宋清","nick":"铁扇子","star":"地俊星","bio":"宋江之弟，负责梁山宴席事务，性情稳重；征方腊后未求官职，返乡奉祀宗族。","kind":"hero","tier":"地煞"},{"n":77,"name":"乐和","nick":"铁叫子","star":"地乐星","bio":"聪明伶俐、精通音律，负责传递军情；征方腊前被王都尉留在府中，得以善终。","kind":"hero","tier":"地煞"},{"n":78,"name":"龚旺","nick":"花项虎","star":"地捷星","bio":"张清副将，善使飞枪，颈上刺有虎斑；征方腊攻打德清时陷入溪中，被乱军杀死。","kind":"hero","tier":"地煞"},{"n":79,"name":"丁得孙","nick":"中箭虎","star":"地速星","bio":"张清副将，面颊带疤，善使飞叉；征方腊途中被毒蛇咬伤身亡。","kind":"hero","tier":"地煞"},{"n":80,"name":"穆春","nick":"小遮拦","star":"地镇星","bio":"揭阳镇穆家二公子，性情豪爽，人称小遮拦；征方腊后受封，辞官返回故乡。","kind":"hero","tier":"地煞"},{"n":81,"name":"曹正","nick":"操刀鬼","star":"地嵇星","bio":"林冲徒弟，精于屠宰牲口，曾经营酒店；征方腊攻打宣州时战死。","kind":"hero","tier":"地煞"},{"n":82,"name":"宋万","nick":"云里金刚","star":"地魔星","bio":"梁山早期元老，身材高大，人称云里金刚；征方腊攻打润州时战死。","kind":"hero","tier":"地煞"},{"n":83,"name":"杜迁","nick":"摸着天","star":"地妖星","bio":"梁山早期元老，身材高长，人称摸着天；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":84,"name":"薛永","nick":"病大虫","star":"地幽星","bio":"江湖卖艺的枪棒教师，出身军官世家；征方腊攻打昱岭关时中箭阵亡。","kind":"hero","tier":"地煞"},{"n":85,"name":"施恩","nick":"金眼彪","star":"地伏星","bio":"孟州牢城管营之子，曾受武松相助夺回快活林；征方腊攻打昆山时落水身亡。","kind":"hero","tier":"地煞"},{"n":86,"name":"周通","nick":"小霸王","star":"地空星","bio":"桃花山头领，惯使长枪，人称小霸王；征方腊攻打独松关时战死。","kind":"hero","tier":"地煞"},{"n":87,"name":"李忠","nick":"打虎将","star":"地僻星","bio":"江湖卖艺出身，曾教史进武艺，后为桃花山头领；征方腊攻打昱岭关时中箭阵亡。","kind":"hero","tier":"地煞"},{"n":88,"name":"杜兴","nick":"鬼脸儿","star":"地全星","bio":"李应管家，面貌凶恶却忠心可靠；征方腊后受封，辞官随李应返回独龙冈。","kind":"hero","tier":"地煞"},{"n":89,"name":"汤隆","nick":"金钱豹子","star":"地孤星","bio":"铁匠出身，善使铁瓜锤，曾设计请徐宁上山；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":90,"name":"邹润","nick":"独角龙","star":"地角星","bio":"登云山头领，额生肉瘤，勇猛善战；征方腊后受封，辞官返回登云山。","kind":"hero","tier":"地煞"},{"n":91,"name":"邹渊","nick":"出林龙","star":"地短星","bio":"登云山头领，性情豪爽，是邹润的叔父；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":92,"name":"朱富","nick":"笑面虎","star":"地藏星","bio":"朱贵之弟，机智善经营，曾设计救出李逵；征方腊期间染病，留在杭州后病逝。","kind":"hero","tier":"地煞"},{"n":93,"name":"朱贵","nick":"旱地忽律","star":"地囚星","bio":"梁山早期耳目，在山下酒店负责打探消息；征方腊期间染病，留在杭州后病逝。","kind":"hero","tier":"地煞"},{"n":94,"name":"蔡福","nick":"铁臂膊","star":"地平星","bio":"大名府刽子手，受柴进等人感化后投奔梁山；征方腊攻打清溪时重伤身亡。","kind":"hero","tier":"地煞"},{"n":95,"name":"蔡庆","nick":"一枝花","star":"地损星","bio":"蔡福之弟，同为大名府刽子手，喜戴鲜花；征方腊后受封，辞官返回故乡。","kind":"hero","tier":"地煞"},{"n":96,"name":"李立","nick":"催命判官","star":"地奴星","bio":"揭阳岭酒店店主，曾以蒙汗药谋财；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":97,"name":"李云","nick":"青眼虎","star":"地察星","bio":"沂水县都头，武艺出众，曾负责押解李逵；征方腊攻打歙州时战死。","kind":"hero","tier":"地煞"},{"n":98,"name":"焦挺","nick":"没面目","star":"地恶星","bio":"相扑世家出身，擅长近身摔跤；征方腊攻打润州时战死。","kind":"hero","tier":"地煞"},{"n":99,"name":"石勇","nick":"石将军","star":"地丑星","bio":"大名府赌徒出身，性情粗豪，善使长枪；征方腊攻打歙州时战死。","kind":"hero","tier":"地煞"},{"n":100,"name":"孙新","nick":"小尉迟","star":"地数星","bio":"孙立之弟，经营酒店，枪棒功夫不弱；征方腊后受封，返回登州任职。","kind":"hero","tier":"地煞"},{"n":101,"name":"顾大嫂","nick":"母大虫","star":"地阴星","bio":"性情豪爽、武艺强悍，曾组织劫牢救人；征方腊后受封，随孙新返回登州。","kind":"hero","tier":"地煞"},{"n":102,"name":"张青","nick":"菜园子","star":"地刑星","bio":"孟州十字坡酒店店主，擅长经营和接应；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":103,"name":"孙二娘","nick":"母夜叉","star":"地壮星","bio":"张青之妻，性情泼辣、武艺强悍，人称母夜叉；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":104,"name":"王定六","nick":"活闪婆","star":"地劣星","bio":"扬子江边酒店店主，走跳迅捷，人称活闪婆；征方腊攻打宣州时战死。","kind":"hero","tier":"地煞"},{"n":105,"name":"郁保四","nick":"险道神","star":"地健星","bio":"身材高大，原为强盗，归顺后掌管梁山帅旗；征方腊攻打清溪时战死。","kind":"hero","tier":"地煞"},{"n":106,"name":"白胜","nick":"白日鼠","star":"地耗星","bio":"卖酒闲汉出身，参与智取生辰纲；征方腊期间染病，留在杭州后病逝。","kind":"hero","tier":"地煞"},{"n":107,"name":"时迁","nick":"鼓上蚤","star":"地贼星","bio":"轻功和偷盗本领高超，曾盗甲助破连环马；征方腊后返京途中患病，在杭州去世。","kind":"hero","tier":"地煞"},{"n":108,"name":"段景住","nick":"金毛犬","star":"地狗星","bio":"善于识马，因盗得宝马而投奔梁山；征方腊攻打杭州途中船毁落水而亡。","kind":"hero","tier":"地煞"},{"n":111,"name":"童贯","nick":"枢密使","star":"六大恶人","bio":"统兵征讨梁山却接连败阵，后来参与招安并排挤梁山将领；原著结尾仍在朝中掌权，没有明确写其结局。","kind":"villain","tier":"恶人","displayId":"恶01"},{"n":113,"name":"潘金莲","nick":"武大郎之妻","star":"六大恶人","bio":"与西门庆私通，在王婆撮合下毒杀丈夫武大郎；武松查明真相后将她杀死，为兄报仇。","kind":"villain","tier":"恶人","displayId":"恶02"},{"n":114,"name":"高衙内","nick":"高俅养子","star":"六大恶人","bio":"倚仗高俅权势横行，因垂涎林冲之妻而设计逼迫林冲；林娘子自尽后，原著未交代他的明确下场。","kind":"villain","tier":"恶人","displayId":"恶03"},{"n":109,"name":"高俅","nick":"殿帅府太尉","star":"六大恶人","bio":"因善踢毬获宋徽宗宠信，掌权后陷害王进、林冲并多次打压梁山；梁山受招安后他仍居高位，原著未写其获罪结局。","kind":"villain","tier":"恶人","displayId":"恶04"},{"n":110,"name":"蔡京","nick":"当朝太师","star":"六大恶人","bio":"把持朝政、结党营私，其女婿梁中书为他搜刮生辰纲；征方腊后又参与谋害宋江等人，原著未交代其最终下场。","kind":"villain","tier":"恶人","displayId":"恶05"},{"n":112,"name":"西门庆","nick":"阳谷县豪绅","star":"六大恶人","bio":"仗财势横行，与潘金莲私通并参与毒害武大郎；最终被返乡查明真相的武松杀死。","kind":"villain","tier":"恶人","displayId":"恶06"}];

/* ======================== core.js ======================== */
/* core.js —— 渲染核心：场景、环境、聚义碑、相机控制器、后期链路
 * 依赖全局 THREE（vendor/three.min.js 先行加载）
 */

function createCore(container, opts) {
  var lowSpec = !!opts.lowSpec;
  var renderer = new THREE.WebGLRenderer({ antialias: !lowSpec, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowSpec ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060614, 0.0052);

  var camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 500);
  camera.position.set(70, 24, 10);

  var composer = null, bloom = null;
  if (!lowSpec && THREE.EffectComposer) {
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloom = new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.72, 0.55, 0.78);
    composer.addPass(bloom);
    composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
  }

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    if (composer) composer.setSize(innerWidth, innerHeight);
  }
  function render() {
    if (composer) composer.render(); else renderer.render(scene, camera);
  }
  return { renderer, scene, camera, composer, bloom, resize, render, lowSpec };
}

/* ---------- 资源路径：单文件版由 window.__ASSETS__ 提供内嵌 data URI ---------- */
function assetUrl(p) {
  if (typeof window !== 'undefined' && window.__ASSETS__ && window.__ASSETS__[p]) return window.__ASSETS__[p];
  return p;
}

/* ---------- 通用贴图工具 ---------- */
function radialTex(rgb) {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var g = c.getContext('2d');
  var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(' + rgb + ',.9)');
  gr.addColorStop(.4, 'rgba(' + rgb + ',.28)');
  gr.addColorStop(1, 'rgba(' + rgb + ',0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}

function canvasTex(w, h, draw) {
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}

/* 金色画框：盖住原图白边，让卡片像镶了边框。
 * 边框厚度：按短边比例算，但上限压到 12px——太厚会盖住卡背底部那一行小字。 */
function drawCardFrame(g, w, h) {
  var fw = Math.max(6, Math.min(14, Math.round(Math.min(w, h) * 0.05)));
  g.strokeStyle = '#b8893b'; g.lineWidth = fw;
  g.strokeRect(fw / 2, fw / 2, w - fw, h - fw);
  g.strokeStyle = 'rgba(255,238,180,.95)'; g.lineWidth = Math.max(1.5, fw * 0.16);
  g.strokeRect(fw * 0.92, fw * 0.92, w - fw * 1.84, h - fw * 1.84);
  g.fillStyle = 'rgba(255,230,160,.92)';
  var r = fw * 0.34, m = fw * 0.92;
  [[m, m], [w - m, m], [m, h - m], [w - m, h - m]].forEach(function (p) {
    g.beginPath(); g.arc(p[0], p[1], r, 0, Math.PI * 2); g.fill();
  });
}

/* ---------- 环境：星空 / 地面星盘 ---------- */
function buildEnvironment(scene, lowSpec) {
  var env = new THREE.Group();

  // 星空
  var N = lowSpec ? 2600 : 6500;
  var pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  var palette = [[1, 1, 1], [1, .92, .75], [.72, .82, 1], [1, .78, .88]];
  for (var i = 0; i < N; i++) {
    var r = 150 + Math.random() * 130, th = Math.random() * Math.PI * 2;
    var ph = Math.acos(Math.random() * 1.8 - 0.9);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.9 - 12;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    var c = palette[(Math.random() * palette.length) | 0], s = .45 + Math.random() * .55;
    col[i * 3] = c[0] * s; col[i * 3 + 1] = c[1] * s; col[i * 3 + 2] = c[2] * s;
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  var stars = new THREE.Points(g, new THREE.PointsMaterial({
    size: 1.15, vertexColors: true, transparent: true, opacity: .9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  }));
  env.add(stars);

  // 地面
  var discTex = canvasTex(1024, 1024, function (g2) {
    var gr = g2.createRadialGradient(512, 512, 0, 512, 512, 512);
    gr.addColorStop(0, '#221a4e'); gr.addColorStop(.45, '#141033'); gr.addColorStop(1, '#05040f');
    g2.fillStyle = gr; g2.fillRect(0, 0, 1024, 1024);
  });
  var disc = new THREE.Mesh(new THREE.CircleGeometry(150, 72), new THREE.MeshBasicMaterial({ map: discTex }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = -0.02; env.add(disc);

  var grid = new THREE.PolarGridHelper(64, 24, 10, 96, 0x8a6a2f, 0x39306a);
  grid.material.transparent = true; grid.material.opacity = 0.20; grid.position.y = 0.01; env.add(grid);
  var grid2 = new THREE.PolarGridHelper(30, 12, 5, 72, 0x6a5426, 0x2c2560);
  grid2.material.transparent = true; grid2.material.opacity = 0.14; grid2.position.y = 0.015; env.add(grid2);

  scene.add(env);
  return { group: env, stars: stars };
}

/* ---------- 聚义碑 ---------- */
function buildStele(scene) {
  var stele = new THREE.Group();
  var textTex = canvasTex(256, 1024, function (g, w, h) {
    g.clearRect(0, 0, w, h);
    g.font = '600 170px "Songti SC","STSong","SimSun",serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(255,210,120,.95)'; g.shadowBlur = 26;
    g.fillStyle = '#ffe9b0';
    ['替', '天', '行', '道'].forEach(function (ch, i) { g.fillText(ch, 128, 148 + i * 236); });
  });

  var pillar = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.5, 15, 8, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x0d0a24, side: THREE.DoubleSide }));
  pillar.position.y = 7.5; stele.add(pillar);

  for (var k = 0; k < 4; k++) {
    var a = k * Math.PI / 2;
    // 文字面板放在柱面外侧，避免被圆柱遮挡/"劈开"
    var p = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 11.6),
      new THREE.MeshBasicMaterial({ map: textTex, transparent: true, side: THREE.DoubleSide }));
    p.position.set(Math.sin(a) * 2.75, 7.5, Math.cos(a) * 2.75);
    p.rotation.y = a; stele.add(p);
  }
  var cap = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.6, 8), new THREE.MeshBasicMaterial({ color: 0x2a2154 }));
  cap.position.y = 15.8; stele.add(cap);

  // 顶部光球（触发恶人密室的机关）
  var orb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffdf9e }));
  orb.position.y = 17.3; orb.userData.isOrb = true; stele.add(orb);
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('255,214,130'), transparent: true, opacity: .65,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  glow.scale.set(9, 9, 1); glow.position.y = 17.3; stele.add(glow);

  var base = new THREE.Mesh(new THREE.RingGeometry(3.2, 5.6, 48),
    new THREE.MeshBasicMaterial({ color: 0x8a6a2f, transparent: true, opacity: .35, side: THREE.DoubleSide }));
  base.rotation.x = -Math.PI / 2; base.position.y = 0.03; stele.add(base);

  scene.add(stele);
  return { group: stele, orb: orb, glow: glow };
}

/* ---------- 相机控制器 ---------- */
class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.curve = null;
    this.u = 0;
    this.period = 130;
    this.mode = 'cruise';           // cruise | focus
    this.curPos = camera.position.clone();
    this.curLook = new THREE.Vector3(0, 8, 0);
    this.focusPos = new THREE.Vector3();
    this.focusLook = new THREE.Vector3();
    this.center = new THREE.Vector3(0, 8.5, 0);
    this.enabled = true;
    this.lastScrub = -1e9;        // 最近一次手动滑动的时间戳（用于暂停自动巡航）
    this._a = new THREE.Vector3(); this._b = new THREE.Vector3();
  }
  setCurve(curve) { this.curve = curve; }
  focus(pos, look) {
    this.mode = 'focus';
    this.focusPos.copy(pos); this.focusLook.copy(look);
  }
  release() { this.mode = 'cruise'; }
  update(dt, nx, ny) {
    if (!this.enabled) return;
    if (this.mode === 'focus') {
      var kF = 1 - Math.exp(-dt * 2.6);
      this.curPos.lerp(this.focusPos, kF);
      this._b.copy(this.focusLook);
      this._b.x += nx * 1.2; this._b.y += -ny * 0.8;
      this.curLook.lerp(this._b, kF);
    } else if (this.curve) {
      if (performance.now() - this.lastScrub > 1400) {
        this.u = (this.u + dt / this.period) % 1;   // 滑动后 1.4s 内不自动前进
      }
      this.curve.getPointAt(this.u, this._a);
      this.curve.getPointAt((this.u + 0.012) % 1, this._b);
      this._b.multiplyScalar(0.72).addScaledVector(this.center, 0.28);
      this._b.x += nx * 5; this._b.y += -ny * 2.5;
      var kC = 1 - Math.exp(-dt * 2.2);
      this.curPos.lerp(this._a, kC);
      this.curLook.lerp(this._b, kC);
    }
    this.camera.position.copy(this.curPos);
    this.camera.lookAt(this.curLook);
  }
}

/* ======================== cards.js ======================== */
/* cards.js —— 卡牌构建与四类工艺材质
 * 工艺：standard 普卡 / flash_prize 奖闪（镭射）/ code_perm 冷烫 / character_art 立绘
 */

/* 工艺参数表：同一套 shader，靠 uniform 拉开差异 */
const CRAFTS = {
  standard: {
    label: '普卡', dir: 'standard',
    strength: 0.0, fresnelPow: 3.0, bandMix: 0.0, stripe: 10, speed: 0.0,
    tint: [1.0, 0.98, 0.92], glow: '235,225,200', glowOpacity: 0.0,
    desc: '无镭射 · 哑光纸感（不闪）'
  },
  flash_prize: {
    label: '奖闪（镭射）', dir: 'flash_prize',
    strength: 1.0, fresnelPow: 2.0, bandMix: 0.35, stripe: 26, speed: 0.95,
    tint: [1.0, 1.0, 1.0], glow: '255,205,115', glowOpacity: 0.55,
    desc: '硬闪镭射 · 视角彩虹流光'
  },
  code_perm: {
    label: '冷烫', dir: 'code_perm',
    strength: 0.78, fresnelPow: 4.5, bandMix: 0.08, stripe: 14, speed: 0.5,
    tint: [0.85, 0.92, 1.0], glow: '175,205,255', glowOpacity: 0.36,
    desc: '烫金烫银 · 冷色金属锐光'
  },
  character_art: {
    label: '立绘', dir: 'character_art',
    strength: 0.26, fresnelPow: 2.5, bandMix: 0.05, stripe: 8, speed: 0.28,
    tint: [1.0, 0.96, 0.9], glow: '255,235,205', glowOpacity: 0.22,
    desc: '无框原画 · 极柔光晕'
  }
};

const CARD_W = 2.35, CARD_H = 3.5, CARD_T = 0.06;

/* ---------- 卡背（程序生成） ---------- */
let _backTex = null;
function backTexture() { return backTextureFor(null); }

/* 卡背：按人物生成（排名 / 星位 / 绰号 / 姓名）。
 * 卡片右键翻转是绕本地 Y 轴转 180°；实测翻开后背面从外侧看就是正向可读，
 * 因此卡背纹理按正常方向绘制即可，不要做预镜像。 */
function backTextureFor(char) {
  if (!char) {
    if (_backTex) return _backTex;
  }
  var c = document.createElement('canvas'); c.width = 512; c.height = 380;
  var g = c.getContext('2d');
  var grad = g.createLinearGradient(0, 0, 512, 380);
  grad.addColorStop(0, '#241a52'); grad.addColorStop(.5, '#120c30'); grad.addColorStop(1, '#2b1d5e');
  g.fillStyle = grad; g.fillRect(0, 0, 512, 380);
  g.strokeStyle = 'rgba(216,181,106,.85)'; g.lineWidth = 3; g.strokeRect(10, 10, 492, 360);
  g.strokeStyle = 'rgba(216,181,106,.4)'; g.lineWidth = 1; g.strokeRect(20, 20, 472, 340);
  g.textAlign = 'center';
  if (char) {
    g.fillStyle = 'rgba(232,196,118,.92)';
    g.font = '600 22px "Songti SC","STSong","SimSun",serif';
    var rank = char.kind === 'villain' ? ('六大恶人 · ' + (char.displayId || '')) : ('梁山第 ' + String(char.n).padStart(3, '0') + ' 位');
    g.fillText(rank, 256, 54);
    g.font = '600 18px "Songti SC","STSong","SimSun",serif';
    var tier = char.kind === 'villain' ? '奸佞之徒' : (char.n <= 36 ? '三十六天罡' : '七十二地煞');
    g.fillText(tier + ' · ' + char.star, 256, 82);
  }
  g.save(); g.translate(256, 196);
  g.strokeStyle = 'rgba(216,181,106,.55)'; g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, 86, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(0, 0, 72, 0, Math.PI * 2); g.stroke();
  g.font = '600 60px "Songti SC","STSong","SimSun",serif';
  g.textBaseline = 'middle';
  g.fillStyle = '#e8c476'; g.shadowColor = 'rgba(255,210,120,.8)'; g.shadowBlur = 14;
  g.fillText('水滸', 0, 4);
  g.restore();
  if (char) {
    g.shadowBlur = 0;
    g.fillStyle = '#f0e8d8'; g.font = '600 40px "Songti SC","STSong","SimSun",serif';
    g.fillText(char.nick || '', 256, 302);
    g.fillStyle = 'rgba(232,196,118,.95)'; g.font = '700 30px "Songti SC","STSong","SimSun",serif';
    g.fillText(char.name, 256, 340);
  } else {
    g.font = '18px serif'; g.fillStyle = 'rgba(232,196,118,.7)'; g.textAlign = 'center';
    g.fillText('一百单八将 · 星穹卡馆', 256, 342);
  }
  drawCardFrame(g, 512, 380);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  if (!char) _backTex = t;
  return t;
}

/* 镭射/冷烫卡背面：独立的全息箔背（不再使用原图右半）。
 * 程序化生成彩虹斜条 + 扫描线 + 水滸印 + 工艺标识。 */
let _laserBackTex = {};
function laserBackTexture(craftId) {
  if (_laserBackTex[craftId]) return _laserBackTex[craftId];
  var craft = CRAFTS[craftId] || CRAFTS.flash_prize;
  var w = 512, h = 380;
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  var g = c.getContext('2d');
  // 深色全息底
  var grad = g.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0b0920'); grad.addColorStop(0.5, '#151030'); grad.addColorStop(1, '#0b0920');
  g.fillStyle = grad; g.fillRect(0, 0, w, h);
  // 对角彩虹条
  g.save(); g.rotate(-Math.PI / 6);
  for (var i = -8; i < 18; i++) {
    var hue = (i * 32 + 200) % 360;
    g.fillStyle = 'hsla(' + hue + ', 78%, 58%, 0.10)';
    g.fillRect(i * 42 - 180, -400, 16, 1200);
  }
  g.restore();
  // 细密扫描线
  g.fillStyle = 'rgba(255,255,255,0.025)';
  for (var y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);
  // 外框
  g.strokeStyle = 'rgba(216,181,106,.82)'; g.lineWidth = 3; g.strokeRect(10, 10, 492, 360);
  g.strokeStyle = 'rgba(216,181,106,.32)'; g.lineWidth = 1; g.strokeRect(20, 20, 472, 340);
  // 中央水滸印
  g.save(); g.translate(w / 2, h / 2 - 10);
  g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, 86, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(0, 0, 72, 0, Math.PI * 2); g.stroke();
  g.font = '600 64px "Songti SC","STSong","SimSun",serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#e8c476'; g.shadowColor = 'rgba(255,210,120,.8)'; g.shadowBlur = 16;
  g.fillText('水滸', 0, 0);
  g.restore();
  // 工艺名
  g.shadowBlur = 0;
  g.font = 'bold 36px "Songti SC","STSong",serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(255,255,255,.92)';
  g.fillText(craft.label.replace('（镭射）', ''), w / 2, h - 58);
  g.font = '18px serif'; g.fillStyle = 'rgba(200,200,220,.6)';
  g.fillText('星穹卡馆 · HOLO FOIL', w / 2, h - 26);
  drawCardFrame(g, w, h);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  _laserBackTex[craftId] = t;
  return t;
}

/* 翻转 / 微摆动：返回卡片应朝向的有效四元数（含 180° 翻转与轻微漂浮波动） */
var _UP = new THREE.Vector3(0, 1, 0), _ZAX = new THREE.Vector3(0, 0, 1);
var _flipQ = new THREE.Quaternion(), _wobQ = new THREE.Quaternion(), _effQ = new THREE.Quaternion();
var gWave = 0;
function effectiveQuat(d, t) {
  _effQ.copy(d.targetQuat);
  if (d.flipped) { _flipQ.setFromAxisAngle(_UP, Math.PI); _effQ.multiply(_flipQ); }
  var wob = Math.sin(t * 0.5 + d.phase) * 0.028 + gWave * 0.14 * Math.sin(d.phase * 2.0 + t * 3.0);
  _wobQ.setFromAxisAngle(_ZAX, wob); _effQ.multiply(_wobQ);
  return _effQ;
}

/* ---------- 流光 shader（参数化） ---------- */
function holoMaterial(craft, phase) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uPhase: { value: phase },
      uStrength: { value: craft.strength },
      uFresnelPow: { value: craft.fresnelPow },
      uBandMix: { value: craft.bandMix },
      uStripe: { value: craft.stripe },
      uSpeed: { value: craft.speed },
      uTint: { value: new THREE.Vector3(craft.tint[0], craft.tint[1], craft.tint[2]) }
    },
    vertexShader:
      'varying vec3 vN; varying vec3 vV; varying vec2 vUv;\n' +
      'void main(){ vUv = uv;\n' +
      '  vec4 wp = modelMatrix * vec4(position, 1.0);\n' +
      '  vN = normalize(mat3(modelMatrix) * normal);\n' +
      '  vV = cameraPosition - wp.xyz;\n' +
      '  gl_Position = projectionMatrix * viewMatrix * wp; }',
    fragmentShader:
      'uniform float uTime, uPhase, uStrength, uFresnelPow, uBandMix, uStripe, uSpeed;\n' +
      'uniform vec3 uTint;\n' +
      'varying vec3 vN; varying vec3 vV; varying vec2 vUv;\n' +
      'void main(){\n' +
      '  vec3 N = normalize(vN); vec3 V = normalize(vV);\n' +
      '  float fres = pow(1.0 - abs(dot(N, V)), uFresnelPow);\n' +
      '  float band = sin(vUv.y * uStripe + uTime * uSpeed + fres * 12.0 + uPhase);\n' +
      '  float band2 = sin((vUv.x + vUv.y) * uStripe * 0.6 - uTime * uSpeed * 0.7 + uPhase * 1.7);\n' +
      '  vec3 rainbow = 0.5 + 0.5 * cos(6.2832 * (fres * 1.6 + band * uBandMix + band2 * 0.15) + vec3(0.0, 2.1, 4.2));\n' +
      '  float scan = 0.5 + 0.5 * sin(vUv.y * 150.0 - uTime * 2.2);\n' +
      '  float glit = step(0.93, fract(sin(dot(floor(vUv * 90.0), vec2(12.99, 78.23)) + uTime * 0.35) * 43758.5453));\n' +
      '  float a = (fres * 0.5 + max(band, 0.0) * uBandMix * 0.3 + max(band2, 0.0) * 0.04 + scan * 0.05 + glit * 0.6) * uStrength;\n' +
      '  vec3 col = rainbow * uTint + glit * vec3(1.0) * 0.6;\n' +
      '  gl_FragColor = vec4(col, a * 0.7); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
}

/* ---------- 名牌 sprite ---------- */
function nameSprite(char, isTG, isVillain) {
  var c = document.createElement('canvas'); c.width = 360; c.height = 84;
  var g = c.getContext('2d');
  g.font = '600 34px "Songti SC","STSong","SimSun",serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 7;
  g.fillStyle = isVillain ? '#ffb3b3' : (isTG ? '#ffe4ac' : '#d7e2ff');
  var label = char.kind === 'villain'
    ? (char.displayId + ' ' + char.name)
    : (String(char.n).padStart(3, '0') + ' ' + char.nick + '·' + char.name);
  g.fillText(label, 180, 42);
  var s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false
  }));
  s.scale.set(2.6, 0.6, 1); s.position.y = 2.05;
  return s;
}

/* ---------- 单张卡 ---------- */
function createCard(char, frontTex, craftId) {
  var craft = CRAFTS[craftId] || CRAFTS.standard;
  var isTG = char.kind === 'hero' && char.n <= 36;
  var isVillain = char.kind === 'villain';
  var isLaser = craftId === 'flash_prize' || craftId === 'code_perm';

  var grp = new THREE.Group();
  var edge = new THREE.MeshLambertMaterial({ color: 0x0a0818 });
  var backTex = isLaser ? laserBackTexture(craftId) : backTextureFor(char);
  var box = new THREE.Mesh(new THREE.BoxGeometry(CARD_W, CARD_H, CARD_T), [
    edge, edge, edge, edge,
    new THREE.MeshBasicMaterial({ map: frontTex }),
    new THREE.MeshBasicMaterial({ map: backTex })
  ]);
  box.userData.char = char; grp.add(box);

  // 隐形热区（大于卡面 35%，提升点击容错）
  var hit = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W * 1.35, CARD_H * 1.35),
    new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.z = 0.05; hit.userData.char = char; grp.add(hit);

  var holoMat = holoMaterial(craft, Math.random() * 6.28);
  var holo = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H), holoMat);
  holo.position.z = CARD_T / 2 + 0.015; grp.add(holo);

  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex(isVillain ? '255,120,120' : (isTG ? '255,205,115' : '135,170,255')),
    transparent: true, opacity: craft.glowOpacity,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  glow.scale.set(5.5, 7.5, 1); glow.position.z = -0.8; grp.add(glow);

  grp.add(nameSprite(char, isTG, isVillain));

  grp.userData = {
    char: char, mesh: box, hit: hit, holoMat: holoMat, glow: glow,
    phase: Math.random() * 6.28,
    targetPos: new THREE.Vector3(), targetQuat: new THREE.Quaternion(),
    baseY: 0, moving: false, flipped: false, craftGlow: craft.glowOpacity
  };
  return grp;
}

/* ---------- 切换工艺：重绑纹理 + 过渡 shader 参数 ---------- */
function applyCraft(cards, craftId, loadTexture) {
  var craft = CRAFTS[craftId] || CRAFTS.standard;
  var isLaser = craftId === 'flash_prize' || craftId === 'code_perm';
  cards.forEach(function (grp) {
    var d = grp.userData;
    // 单文件版只有标准原图（已中分裁剪为正反面），切换工艺时只改 shader/glow，不重载正面
    if (!SINGLE || d.char.kind === 'villain') {
      var url = d.char.kind === 'villain'
        ? assetUrl('assets/villains/' + d.char.n + '.webp')
        : assetUrl('assets/' + craft.dir + '/' + d.char.n + '.webp');
      loadTexture(url, function (tex) {
        d.mesh.material[4].map = tex;
        d.mesh.material[4].needsUpdate = true;
      });
    }
    // 背面：镭射/冷烫使用独立全息箔背；普卡/立绘恢复人物信息背
    if (isLaser) {
      d.mesh.material[5].map = laserBackTexture(craftId);
      d.mesh.material[5].needsUpdate = true;
    } else if (d.char.kind === 'hero') {
      loadSplitCard(assetUrl('assets/standard/' + d.char.n + '.webp'), function (pair) {
        if (!pair || currentCraft !== 'standard') return;
        d.mesh.material[5].map = pair.back;
        d.mesh.material[5].needsUpdate = true;
      });
    } else {
      d.mesh.material[5].map = backTextureFor(d.char);
      d.mesh.material[5].needsUpdate = true;
    }
    d.holoMat.uniforms.uStrength.value = craft.strength;
    d.holoMat.uniforms.uFresnelPow.value = craft.fresnelPow;
    d.holoMat.uniforms.uBandMix.value = craft.bandMix;
    d.holoMat.uniforms.uStripe.value = craft.stripe;
    d.holoMat.uniforms.uSpeed.value = craft.speed;
    d.holoMat.uniforms.uTint.value.set(craft.tint[0], craft.tint[1], craft.tint[2]);
    d.craftGlow = craft.glowOpacity;
    if (!d.flipped) d.glow.material.opacity = craft.glowOpacity;
  });
}

/* ======================== layouts.js ======================== */
/* layouts.js —— 三种展厅布局与切换调度
 * ① dualRing 天罡地煞双星环  ② islands 悬浮岛屿  ③ corridor 悬浮长廊（螺旋）
 */

function faceQuat(pos, target) {
  var t = new THREE.Object3D();
  t.position.copy(pos); t.lookAt(target);
  return t.quaternion.clone();
}
var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };

/* ============ ① 天罡地煞双星环 ============ */
const dualRing = {
  id: 'dualRing',
  name: '天罡地煞双星环',
  hint: '天罡悬于天 · 地煞铺于地',
  center: [0, 8.5, 0],
  hideStele: false,
  place(cards) {
    cards.forEach(function (grp) {
      var c = grp.userData.char;
      var isTG = c.n <= 36;
      var R = isTG ? 26 : 52, Y = isTG ? 13 : 4.5;
      var idx = isTG ? c.n - 1 : c.n - 37;
      var total = isTG ? 36 : 72;
      var a = (idx / total) * Math.PI * 2;
      var px = Math.sin(a) * R, pz = Math.cos(a) * R;
      grp.userData.targetPos.set(px, Y, pz);
      grp.userData.baseY = Y;
      grp.userData.targetQuat.copy(faceQuat(V(px, Y, pz), V(px * 2, Y, pz * 2)));
    });
  },
  cruise() {
    return new THREE.CatmullRomCurve3([
      V(74, 26, 6), V(60, 11, 28), V(46, 7, 46), V(14, 7.5, 60), V(-32, 7, 52),
      V(-58, 11, 16), V(-46, 16, -18), V(-22, 16, -27), V(0, 17.5, -36), V(22, 16, -27),
      V(34, 13.5, -8), V(28, 12, 18), V(6, 10, 34), V(28, 14, 40), V(58, 22, 24)
    ], true, 'catmullrom', 0.5);
  },
  decor() { return null; }
};

/* ============ ② 悬浮岛屿 ============ */
const ISLAND_COUNT = 6, PER_ISLAND = 18;
const islands = {
  id: 'islands',
  name: '悬浮岛屿',
  hint: '水泊梁山 · 六岛聚义',
  center: [0, 10, 0],
  hideStele: false,
  place(cards) {
    cards.forEach(function (grp, i) {
      var isle = Math.floor(i / PER_ISLAND);
      var k = i % PER_ISLAND;
      var ringR = 42 + (isle % 2) * 8;
      var ang = (isle / ISLAND_COUNT) * Math.PI * 2;
      var cx = Math.sin(ang) * ringR, cz = Math.cos(ang) * ringR;
      var cy = 7 + ((isle * 3) % 5);
      var a = (k / PER_ISLAND) * Math.PI * 2;
      var px = cx + Math.sin(a) * 12;
      var pz = cz + Math.cos(a) * 12;
      var py = cy + 3.6 + Math.sin(k * 0.9) * 0.5;   // 抬高：保证浮动到最低点时也不沉入岛盘（盘顶 cy+0.4）
      grp.userData.targetPos.set(px, py, pz);
      grp.userData.baseY = py;
      grp.userData.targetQuat.copy(faceQuat(V(px, py, pz), V(cx + (px - cx) * 3, py, cz + (pz - cz) * 3)));
    });
  },
  cruise() {
    var pts = [];
    for (var i = 0; i < ISLAND_COUNT; i++) {
      var ang = (i / ISLAND_COUNT) * Math.PI * 2 + 0.35;
      var R = 42 + (i % 2) * 8;
      pts.push(V(Math.sin(ang) * (R + 18), 11 + (i % 3) * 3, Math.cos(ang) * (R + 18)));
    }
    pts.push(V(0, 30, 0));
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
  },
  decor(scene) {
    var g = new THREE.Group();
    for (var i = 0; i < ISLAND_COUNT; i++) {
      var ang = (i / ISLAND_COUNT) * Math.PI * 2;
      var R = 42 + (i % 2) * 8;
      var x = Math.sin(ang) * R, z = Math.cos(ang) * R, y = 7 + ((i * 3) % 5);
      var top = new THREE.Mesh(new THREE.CylinderGeometry(14, 13, 0.8, 28),
        new THREE.MeshBasicMaterial({ color: 0x150f34 }));
      top.position.set(x, y, z); g.add(top);
      var rim = new THREE.Mesh(new THREE.RingGeometry(13, 14.4, 56),
        new THREE.MeshBasicMaterial({ color: 0x8a6a2f, transparent: true, opacity: .5, side: THREE.DoubleSide }));
      rim.rotation.x = -Math.PI / 2; rim.position.set(x, y + 0.4, z); g.add(rim);
      var rock = new THREE.Mesh(new THREE.ConeGeometry(11, 9, 20),
        new THREE.MeshBasicMaterial({ color: 0x090718 }));
      rock.position.set(x, y - 4.2, z); rock.rotation.x = Math.PI; g.add(rock);
      var halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialTex('150,130,255'), transparent: true, opacity: .3,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo.scale.set(30, 18, 1); halo.position.set(x, y - 3, z); g.add(halo);
    }
    scene.add(g);
    return g;
  }
};

/* ============ ③ 悬浮长廊（螺旋） ============ */
const TURNS = 3, TOP_Y = 42;
const corridor = {
  id: 'corridor',
  name: '悬浮长廊',
  hint: '螺旋上行 · 步步登堂',
  center: [0, 20, 0],
  hideStele: true,
  place(cards) {
    var n = cards.length;
    cards.forEach(function (grp, i) {
      var t = i / n;
      var a = t * Math.PI * 2 * TURNS;
      var R = 22 + t * 8;
      var px = Math.sin(a) * R, pz = Math.cos(a) * R, py = 3.8 + t * TOP_Y;
      grp.userData.targetPos.set(px, py, pz);
      grp.userData.baseY = py;
      // 朝向中轴
      grp.userData.targetQuat.copy(faceQuat(V(px, py, pz), V(0, py, 0)));
    });
  },
  cruise() {
    var pts = [], n = 14;
    for (var i = 0; i < n; i++) {
      var t = i / n;
      var a = t * Math.PI * 2 * TURNS;
      var R = 22 + t * 8;
      pts.push(V(Math.sin(a) * R, 4.2 + t * TOP_Y, Math.cos(a) * R));
    }
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  },
  decor(scene) {
    var g = new THREE.Group();
    // 中轴光柱
    var axis = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, TOP_Y + 6, 12),
      new THREE.MeshBasicMaterial({ color: 0x2a2154 }));
    axis.position.y = (TOP_Y + 6) / 2; g.add(axis);
    var core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, TOP_Y + 6, 8),
      new THREE.MeshBasicMaterial({ color: 0xffdf9e }));
    core.position.y = (TOP_Y + 6) / 2; g.add(core);
    // 螺旋导引线
    var pts = [];
    for (var i = 0; i <= 120; i++) {
      var t = i / 120;
      var a = t * Math.PI * 2 * TURNS, R = 22 + t * 8;
      pts.push(V(Math.sin(a) * R, 2.2 + t * TOP_Y, Math.cos(a) * R));
    }
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x8a6a2f, transparent: true, opacity: .45 }));
    g.add(line);
    // 中轴光柱顶部标注（纯装饰光轴，便于理解）
    var labelTex = canvasTex(320, 64, function (g2, w, h) {
      g2.clearRect(0, 0, w, h);
      g2.font = '600 30px "Songti SC","STSong","SimSun",serif';
      g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillStyle = 'rgba(216,181,106,.92)';
      g2.shadowColor = 'rgba(255,210,120,.85)'; g2.shadowBlur = 12;
      g2.fillText('中轴光柱（装饰光轴）', w / 2, h / 2);
    });
    var label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthWrite: false }));
    label.scale.set(12, 2.4, 1); label.position.set(0, TOP_Y + 5, 0); g.add(label);
    scene.add(g);
    return g;
  }
};

const LAYOUTS = { dualRing, islands, corridor };
const LAYOUT_ORDER = ['dualRing', 'islands', 'corridor'];

/* ---------- 布局切换调度 ---------- */
class LayoutManager {
  constructor(scene, cards, rig, isVillainCard, stele) {
    this.scene = scene; this.cards = cards; this.rig = rig;
    this.current = null; this.decorGroup = null;
    this.stele = stele || null;
    this.isVillainCard = isVillainCard || function () { return false; };
  }
  apply(id) {
    var L = LAYOUTS[id]; if (!L) return;
    if (this.decorGroup) { this.scene.remove(this.decorGroup); this.decorGroup = null; }
    var heroCards = this.cards.filter(function (g) { return !this.isVillainCard(g); }, this);
    L.place(heroCards);
    this.decorGroup = L.decor(this.scene);
    this.rig.setCurve(L.cruise());
    this.rig.u = 0;
    if (L.center) this.rig.center.set(L.center[0], L.center[1], L.center[2]);
    if (this.stele) this.stele.group.visible = !L.hideStele;
    this.current = id;
    // 错峰过渡：用绝对时间戳，与帧率无关
    var now = performance.now();
    this.cards.forEach(function (g, i) {
      g.userData.moving = true;
      g.userData.moveStartAt = now + i * 12;
    });
    return L;
  }
  update(dt, t) {
    var k = 1 - Math.exp(-dt * 1.8);
    var now = performance.now();
    this.cards.forEach(function (grp) {
      var d = grp.userData;
      if (d.moveStartAt && now < d.moveStartAt) return;
      var eff = effectiveQuat(d, t);
      if (d.moving) {
        grp.position.lerp(d.targetPos, k);
        grp.quaternion.slerp(eff, k);
        if (grp.position.distanceTo(d.targetPos) < 0.03) d.moving = false;
      } else {
        grp.position.y = d.targetPos.y + Math.sin(t * 0.7 + d.phase) * 0.22;
        grp.quaternion.slerp(eff, k);
      }
    });
  }
}

/* ======================== features.js ======================== */
/* features.js —— 恶人密室 与 移动端适配 */

/* ============ 恶人密室 ============ */
const VAULT_Y = -26;

function buildVillainRoom(scene, villainCards) {
  var group = new THREE.Group();
  group.position.y = VAULT_Y;

  // 地面与穹顶
  var floor = new THREE.Mesh(new THREE.CircleGeometry(20, 48),
    new THREE.MeshBasicMaterial({ color: 0x1a0810 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; group.add(floor);
  var ring = new THREE.Mesh(new THREE.RingGeometry(16, 19, 48),
    new THREE.MeshBasicMaterial({ color: 0x8a2020, transparent: true, opacity: .4, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; group.add(ring);
  var dome = new THREE.Mesh(new THREE.SphereGeometry(22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x140610, side: THREE.BackSide }));
  group.add(dome);

  // 中央血色光柱
  var beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.6, 14, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true, opacity: .22, side: THREE.DoubleSide }));
  beam.position.y = 7; group.add(beam);
  var core = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff5566 }));
  core.position.y = 0.9; group.add(core);
  var halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('255,70,80'), transparent: true, opacity: .75,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  halo.scale.set(16, 16, 1); halo.position.y = 0.9; group.add(halo);

  // 6 张恶人卡排成扇形展墙，全部面向入口（相对密室组坐标）
  villainCards.forEach(function (grp, i) {
    var R = 9;
    var a = (i - (villainCards.length - 1) / 2) * 0.36;   // 扇形张角约 ±52°
    var px = Math.sin(a) * R, pz = Math.cos(a) * R, py = 3;
    grp.position.set(px, py, pz);
    var t = new THREE.Object3D();
    t.position.set(px, py, pz);
    t.lookAt(0, py, 42);            // 朝向入口方向
    grp.quaternion.copy(t.quaternion);
    grp.userData.targetPos.set(px, py, pz);
    grp.userData.targetQuat.copy(t.quaternion);
    grp.userData.baseY = py;
    group.add(grp);
  });

  group.visible = false;
  scene.add(group);

  return {
    group: group,
    open: function () { group.visible = true; },
    close: function () { group.visible = false; },
    enterPos: new THREE.Vector3(0, VAULT_Y + 5.5, 21),
    enterLook: new THREE.Vector3(0, VAULT_Y + 3.2, 6)
  };
}

/* 机关：碑顶光球连点 3 次 */
class OrbTrigger {
  constructor(onUnlock) { this.count = 0; this.onUnlock = onUnlock; this.cool = 0; this.unlocked = false; }
  tap(now) {
    if (this.unlocked) return 0;
    if (now - this.cool > 2.2) this.count = 0;   // 超过 2.2 秒视为新的一次尝试
    this.cool = now; this.count++;
    if (this.count >= 3) { this.unlocked = true; this.onUnlock(); return 3; }
    return this.count;
  }
}

/* ============ 移动端 / 设备能力 ============ */
function isLowSpec() {
  var ua = navigator.userAgent || '';
  var mobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
  var cores = navigator.hardwareConcurrency || 4;
  return mobile || innerWidth < 820 || cores <= 4;
}
function isTouch() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;
}

/* 触控与陀螺仪：把输入归一化为 nx / ny（-1..1）与 pinch 缩放 */
function initInput(canvas, state) {
  var startX = 0, startY = 0, lastX = 0, lastY = 0, pinchDist = 0;

  canvas.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      startX = lastX = e.touches[0].clientX; startY = lastY = e.touches[0].clientY;
      state.dragged = false;
    } else if (e.touches.length === 2) {
      pinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', function (e) {
    if (e.touches.length === 1) {
      var dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      if (Math.hypot(lastX - startX, lastY - startY) > 6) state.dragged = true;
      // 鉴赏模式下手指拖动用于切换卡片（走马灯），不再驱动环视，避免两种手势打架
      if (focusChar) return;
      state.nx = Math.max(-1, Math.min(1, state.nx + dx / innerWidth * 3));
      state.ny = Math.max(-1, Math.min(1, state.ny + dy / innerHeight * 3));
    } else if (e.touches.length === 2) {
      var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      state.pinch = (d - pinchDist) * 0.02; pinchDist = d;
    }
  }, { passive: true });

  // 陀螺仪（iOS 需手势授权，未授权时静默失败）
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null || e.beta == null) return;
    state.nx = Math.max(-1, Math.min(1, e.gamma / 35));
    state.ny = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
  });
}

/* ======================== ui.js ======================== */
/* ui.js —— HUD、布局/工艺切换控件、鉴赏面板 */

function initUI(cb) {
  var els = {
    layoutBar: document.getElementById('layoutBar'),
    craftBar: document.getElementById('craftBar'),
    layoutHint: document.getElementById('layoutHint'),
    mode: document.getElementById('mode'),
    panel: document.getElementById('panel'),
    pClose: document.getElementById('pClose'),
    pImg: document.getElementById('pImg'),
    pStar: document.getElementById('pStar'),
    pRank: document.getElementById('pRank'),
    pNick: document.getElementById('pNick'),
    pName: document.getElementById('pName'),
    pBio: document.getElementById('pBio'),
    pBack: document.getElementById('pBack'),
    entryBtn: document.getElementById('entryBtn'),
    loader: document.getElementById('loader'),
    barFill: document.getElementById('barFill'),
    pct: document.getElementById('pct')
  };

  function buildBar(bar, items, activeId, onPick) {
    bar.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.className = 'chip' + (it.id === activeId ? ' on' : '');
      b.textContent = it.label;
      b.dataset.id = it.id;
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(bar.children, function (c) { c.classList.remove('on'); });
        b.classList.add('on');
        onPick(it.id);
      });
      bar.appendChild(b);
    });
  }

  els.pClose.addEventListener('click', function () { cb.onClosePanel && cb.onClosePanel(); });
  els.entryBtn && els.entryBtn.addEventListener('click', function () { cb.onEnterVault && cb.onEnterVault(); });

  // 窄屏折叠菜单
  var controls = document.getElementById('controls');
  var ctrlToggle = document.getElementById('ctrlToggle');
  if (ctrlToggle) {
    ctrlToggle.addEventListener('click', function () {
      controls.classList.toggle('open');
      ctrlToggle.textContent = controls.classList.contains('open') ? '展厅 / 工艺 ▴' : '展厅 / 工艺 ▾';
    });
  }

  return {
    els: els,
    buildLayoutBar(items, active, pick) { buildBar(els.layoutBar, items, active, pick); },
    buildCraftBar(items, active, pick) {
      buildBar(els.craftBar, items, active, pick);
      var cur = items.filter(function (i) { return i.id === active; })[0];
      els.layoutHint.textContent = cur ? cur.desc : '';
    },
    setHint(text) { els.layoutHint.textContent = text; },
    setMode(text) { els.mode.textContent = text; },
    progress(p) {
      els.barFill.style.width = p + '%';
      els.pct.textContent = p + '%';
      if (p >= 100) setTimeout(function () { els.loader.classList.add('hide'); }, 350);
    },
    openPanel(char) {
      els.pStar.textContent = char.star;
      els.pStar.className = char.kind === 'villain' ? 'vg'
        : (char.n <= 36 ? 'tg' : '');
      els.pRank.textContent = char.kind === 'villain'
        ? '六大恶人 · ' + char.displayId
        : '梁山第 ' + String(char.n).padStart(3, '0') + ' 位 · ' + (char.n <= 36 ? '三十六天罡' : '七十二地煞');
      els.pNick.textContent = char.kind === 'villain' ? (char.nick || '奸佞') : char.nick;
      els.pName.textContent = char.name.split('').join(' ');
      els.pBio.textContent = char.bio || '';
      els.pBack.textContent = char.kind === 'villain'
        ? '—— 六大恶人 · 水浒英雄谱 ——'
        : '—— 水浒英雄谱 · 统一小浣熊 1999 ——';
      els.pImg.src = char.kind === 'villain'
        ? assetUrl('assets/villains/' + char.n + '.webp')
        : assetUrl('assets/full/' + char.n + '.webp');
      els.panel.classList.add('open');
      els.mode.textContent = '鉴赏 · ' + char.name;
    },
    closePanel(modeText) {
      els.panel.classList.remove('open');
      els.mode.textContent = modeText || '自动导览中';
    },
    showEntryBtn(show) {
      if (els.entryBtn) els.entryBtn.style.display = show ? '' : 'none';
    }
  };
}

/* ======================== main.js ======================== */
/* main.js —— 引导与主循环 */






const HEROES = CHARACTERS.filter(function (c) { return c.kind === 'hero'; });
const VILLAINS = CHARACTERS.filter(function (c) { return c.kind === 'villain'; });

const lowSpec = isLowSpec();
const SINGLE = !!window.__SINGLE__;      // 单文件离线版：仅内嵌普卡资源
const core = createCore(document.body, { lowSpec });
const { scene, camera, render, resize } = core;

buildEnvironment(scene, lowSpec);
const stele = buildStele(scene);

const rig = new CameraRig(camera);
const state = { nx: 0, ny: 0, dragged: false, pinch: 0 };
var suppressTapUntil = 0;   // 移动端双击翻面后，抑制紧随其后的合成单击（避免重复聚焦）

/* ---------- 纹理加载与缓存 ---------- */
const texCache = new Map();
const manager = new THREE.LoadingManager();
manager.onProgress = function (url, loaded, total) {
  UI.progress(Math.round(loaded / total * 100));
};
manager.onLoad = function () { UI.progress(100); };
const texLoader = new THREE.TextureLoader(manager);

function loadTex(url, cb) {
  if (texCache.has(url)) { cb(texCache.get(url)); return; }
  texLoader.load(url, function (tex) {
    tex.encoding = THREE.sRGBEncoding;
    texCache.set(url, tex); cb(tex);
  }, undefined, function () { /* 缺失时保持原纹理 */ });
}

/* 水浒卡原图为左右拼接：左半是正面，右半是背面。加载后中分裁剪，
 * 正/背面都按正常方向绘制，翻开后即为正向可读。 */
function loadSplitCard(url, cb) {
  var key = url + '::split';
  if (texCache.has(key)) { cb(texCache.get(key)); return; }
  var img = new Image();
  img.onload = function () {
    var w = img.width / 2, h = img.height;
    // 正面 = 左半；背面 = 右半，均不做镜像
    var cf = document.createElement('canvas'); cf.width = w; cf.height = h;
    var gf = cf.getContext('2d');
    gf.drawImage(img, 0, 0, w, h, 0, 0, w, h);
    drawCardFrame(gf, w, h);
    var tf = new THREE.CanvasTexture(cf); tf.encoding = THREE.sRGBEncoding;
    var cb_ = document.createElement('canvas'); cb_.width = w; cb_.height = h;
    var gb = cb_.getContext('2d');
    gb.drawImage(img, w, 0, w, h, 0, 0, w, h);
    drawCardFrame(gb, w, h);
    var tb = new THREE.CanvasTexture(cb_); tb.encoding = THREE.sRGBEncoding;
    var pair = { front: tf, back: tb };
    texCache.set(key, pair); cb(pair);
  };
  img.onerror = function () { cb(null); };
  img.src = url;
}

/* ---------- UI ---------- */
// 单文件版只内嵌普卡原图，但可直接给普卡叠加镭射全息膜，所以默认显示镭射效果
let currentCraft = SINGLE ? 'flash_prize' : 'standard';
let currentLayout = 'dualRing';
let inVault = false;
let focusChar = null;
let focusGrp = null;        // 当前鉴赏的卡片组
let focusList = [];         // 鉴赏时可左右切换的卡片序列
let focusDragAccum = 0;     // 鉴赏模式下左右拖动的累计位移

const UI = initUI({
  onClosePanel: function () { exitFocus(); },
  onEnterVault: function () { enterVault(); }
});

// 顶部「拖动空白处左右滑动」提示条已移除（交互改为鉴赏时左右切换）

UI.buildLayoutBar(
  LAYOUT_ORDER.map(function (id) { return { id: id, label: LAYOUTS[id].name }; }),
  currentLayout,
  function (id) { switchLayout(id); }
);
UI.buildCraftBar(
  Object.keys(CRAFTS)
    .filter(function (id) { return !SINGLE || ['standard', 'flash_prize', 'code_perm'].indexOf(id) >= 0; })
    .map(function (id) { return { id: id, label: CRAFTS[id].label, desc: CRAFTS[id].desc }; }),
  currentCraft,
  function (id) { switchCraft(id); }
);
UI.setHint(LAYOUTS[currentLayout].hint);

// 洗牌重组特效按钮（快捷键 R）
(function () {
  var btn = document.getElementById('shuffleBtn');
  if (btn) btn.addEventListener('click', function () { startShuffle(); });
})();

/* ---------- 建卡 ---------- */
const heroCards = [];
const villainCards = [];
const holoMats = [];

HEROES.forEach(function (ch) {
  var grp = createCard(ch, null, currentCraft);
  grp.position.set(0, 0, 0);
  scene.add(grp);
  heroCards.push(grp);
  holoMats.push(grp.userData.holoMat);
  // 单文件版缺失奖闪/冷烫扫描图，所以正面先读必有的普卡原图；背面按工艺决定
  loadSplitCard(assetUrl('assets/standard/' + ch.n + '.webp'), function (pair) {
    if (!pair) return;
    grp.userData.mesh.material[4].map = pair.front;
    if (currentCraft === 'flash_prize' || currentCraft === 'code_perm') {
      grp.userData.mesh.material[5].map = laserBackTexture(currentCraft);
    } else {
      grp.userData.mesh.material[5].map = pair.back;
    }
    grp.userData.mesh.material[4].needsUpdate = true;
    grp.userData.mesh.material[5].needsUpdate = true;
  });
});

VILLAINS.forEach(function (ch) {
  var grp = createCard(ch, null, currentCraft);
  holoMats.push(grp.userData.holoMat);
  villainCards.push(grp);
  loadTex(assetUrl('assets/villains/' + ch.n + '.webp'), function (tex) {
    if (!tex || !tex.image) return;
    var w = tex.image.width, h = tex.image.height;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'); g.drawImage(tex.image, 0, 0); drawCardFrame(g, w, h);
    var ft = new THREE.CanvasTexture(c); ft.encoding = THREE.sRGBEncoding;
    grp.userData.mesh.material[4].map = ft;
    grp.userData.mesh.material[4].needsUpdate = true;
  });
});

const vault = buildVillainRoom(scene, villainCards);

/* ---------- 布局 ---------- */
const layoutManager = new LayoutManager(scene, heroCards, rig, function (g) { return false; }, stele);

/* 翻转辅助：翻转时把发光调暗（避免冲淡背面文字），复位时恢复工艺发光 */
function setCardFlipped(grp, v) {
  grp.userData.flipped = v;
  grp.userData.glow.material.opacity = v ? 0.05 : (grp.userData.craftGlow != null ? grp.userData.craftGlow : 0.28);
}
function resetAllFlips() {
  heroCards.concat(villainCards).forEach(function (g) { setCardFlipped(g, false); });
}

/* ======================== 洗牌重组特效 ======================== */
/* 「星穹洗牌」：卡片爆散飞舞 → 悬停自旋 → 回落归位。
 * 基于每张卡的 targetPos，因此三种展厅（双星环 / 悬浮岛屿 / 悬浮长廊）与恶人密室通用。 */
var SHUF_T_SCATTER = 0.85;   // 爆散
var SHUF_T_HOVER = 0.55;     // 悬停自旋
var SHUF_T_RETURN = 1.25;    // 回落归位
var SHUF_STAGGER = 0.30;     // 逐张错峰总时长
const SHUF = { active: false, t0: 0, items: [], burst: null, set: null };

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }

function ensureBurst() {
  if (SHUF.burst) return SHUF.burst;
  var s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('255,214,140'), transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  s.visible = false; scene.add(s); SHUF.burst = s;
  return s;
}

function startShuffle() {
  if (SHUF.active) return false;
  var list = inVault ? villainCards : heroCards;
  if (!list.length) return false;
  if (focusChar) exitFocus();
  resetAllFlips();
  for (var ci = 0; ci < list.length; ci++) list[ci].userData.moving = false;

  var center = rig.center.clone();
  var items = list.map(function (grp, i) {
    var d = grp.userData;
    var p0 = grp.position.clone();
    // 以展厅中心为原点向外爆散：径向 + 切向 + 垂直随机
    var out = p0.clone().sub(center); out.y = 0;
    if (out.lengthSq() < 1e-4) out.set(1, 0, 0);
    out.normalize();
    var tan = new THREE.Vector3(-out.z, 0, out.x).normalize();
    var pMid = p0.clone()
      .addScaledVector(out, 9 + Math.random() * 15)
      .addScaledVector(tan, (Math.random() * 2 - 1) * 15);
    pMid.y += (Math.random() * 2 - 1) * 9;
    // 限幅：位移不超过 26，且不低于原位 4 / 不高于原位 12，避免飞出视野或沉入岛体
    var disp = pMid.clone().sub(p0);
    if (disp.length() > 26) { disp.setLength(26); pMid.copy(p0).add(disp); }
    pMid.y = Math.max(p0.y - 1.2, Math.min(p0.y + 12, pMid.y));
    var axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    var it = {
      grp: grp, d: d, p0: p0, pMid: pMid,
      q0: grp.quaternion.clone(), axis: axis,
      spin: (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 5),
      delay: (i / list.length) * SHUF_STAGGER,
      glowBase: d.craftGlow != null ? d.craftGlow : 0.28,
      holoBase: d.holoMat.uniforms.uStrength.value
    };
    // 洗牌期间：提亮光晕与流光（普卡 strength 为 0，保持哑光不闪）
    d.glow.material.opacity = Math.min(0.9, it.glowBase + 0.5);
    if (it.holoBase > 0) d.holoMat.uniforms.uStrength.value = Math.min(1.4, it.holoBase * 2.2);
    return it;
  });

  SHUF.items = items;
  SHUF.set = list;
  SHUF.active = true;
  SHUF.t0 = performance.now() / 1000;
  UI.setMode('星穹洗牌 · 重组中…');

  var b = ensureBurst();
  b.position.copy(center); b.visible = true; b.material.opacity = 0;
  return true;
}

var _shufQ = new THREE.Quaternion();
var _shufQ2 = new THREE.Quaternion();

function updateShuffle(t) {
  var now = performance.now() / 1000;
  var el = now - SHUF.t0;
  var total = SHUF_T_SCATTER + SHUF_T_HOVER + SHUF_T_RETURN + SHUF_STAGGER;
  var allDone = el >= total;

  SHUF.items.forEach(function (it) {
    var grp = it.grp, d = it.d, e = el - it.delay;
    var p1 = d.targetPos;

    if (e <= 0) {
      grp.position.copy(it.p0); grp.quaternion.copy(it.q0);
      return;
    }
    if (e < SHUF_T_SCATTER) {                       // ① 爆散
      var pe = easeOutCubic(e / SHUF_T_SCATTER);
      grp.position.lerpVectors(it.p0, it.pMid, pe);
      _shufQ.setFromAxisAngle(it.axis, it.spin * pe);
      grp.quaternion.copy(it.q0).multiply(_shufQ);
    } else if (e < SHUF_T_SCATTER + SHUF_T_HOVER) { // ② 悬停自旋
      var eh = e - SHUF_T_SCATTER;
      grp.position.copy(it.pMid);
      grp.position.y += Math.sin(eh * 4.0 + d.phase) * 0.3;
      _shufQ.setFromAxisAngle(it.axis, it.spin + eh * 1.6);
      grp.quaternion.copy(it.q0).multiply(_shufQ);
    } else if (e < SHUF_T_SCATTER + SHUF_T_HOVER + SHUF_T_RETURN) { // ③ 回落归位
      var er = e - SHUF_T_SCATTER - SHUF_T_HOVER;
      var pr = easeInOutCubic(clamp01(er / SHUF_T_RETURN));
      grp.position.lerpVectors(it.pMid, p1, pr);
      _shufQ.setFromAxisAngle(it.axis, it.spin + SHUF_T_HOVER * 1.6);
      _shufQ2.copy(it.q0).multiply(_shufQ);
      grp.quaternion.copy(_shufQ2).slerp(effectiveQuat(d, t), pr);
    } else {                                        // ④ 到位
      grp.position.copy(p1);
      grp.quaternion.slerp(effectiveQuat(d, t), 0.25);
    }
  });

  // 能量冲击波：先外扩炸开，再内缩回收
  var b = SHUF.burst;
  if (b && b.visible) {
    if (el < 1.0) {
      var q1 = clamp01(el / 1.0);
      b.scale.setScalar(8 + q1 * 122);
      b.material.opacity = 0.8 * (1 - q1);
    } else if (el < SHUF_T_SCATTER + SHUF_T_HOVER) {
      b.material.opacity = 0;
    } else if (el < total) {
      var q2 = clamp01((el - SHUF_T_SCATTER - SHUF_T_HOVER) / SHUF_T_RETURN);
      b.scale.setScalar(130 - q2 * 118);
      b.material.opacity = 0.45 * (1 - q2);
    } else {
      b.material.opacity = 0; b.visible = false;
    }
  }

  if (allDone) endShuffle();
}

function endShuffle() {
  SHUF.items.forEach(function (it) {
    var d = it.d;
    d.moving = true;                                  // 交回常规过渡逻辑
    d.glow.material.opacity = d.flipped ? 0.05 : it.glowBase;
    d.holoMat.uniforms.uStrength.value = it.holoBase;
  });
  if (SHUF.burst) { SHUF.burst.visible = false; SHUF.burst.material.opacity = 0; }
  SHUF.active = false; SHUF.items = []; SHUF.set = null;
  UI.setMode(inVault ? '恶人密室' : '自动导览中');
}

function switchLayout(id, fx) {
  currentLayout = id;
  layoutManager.apply(id);
  UI.setHint(LAYOUTS[id].hint);
  resetAllFlips();          // 切换展厅/全景即把所有卡片翻回正面
  if (focusChar) exitFocus();
  // 换展厅时自动来一次「星穹洗牌」，让每种模式都有重组特效（首次布展除外）
  if (fx !== false) setTimeout(function () { startShuffle(); }, 60);
}
switchLayout(currentLayout, false);

/* ---------- 工艺切换 ---------- */
function switchCraft(id) {
  if (id === currentCraft) return;
  currentCraft = id;
  UI.setMode('切换工艺中…');
  applyCraft(heroCards.concat(villainCards), id, loadTex);
  setTimeout(function () { UI.setMode(focusChar ? '鉴赏 · ' + focusChar.name : '自动导览中'); }, 600);
}

/* ---------- 交互 ---------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clickTargets = [];
heroCards.forEach(function (g) { clickTargets.push(g.userData.hit, g.userData.mesh); });
villainCards.forEach(function (g) { clickTargets.push(g.userData.hit, g.userData.mesh); });
clickTargets.push(stele.orb);

const orbTrigger = new OrbTrigger(function () {
  UI.setMode('密室已开启 · 点击右下角进入');
  UI.showEntryBtn(true);
});

core.renderer.domElement.addEventListener('pointerdown', function (e) {
  state.downX = e.clientX; state.downY = e.clientY; state.dragged = false;
  state.isDown = true; state.downBtn = e.button; state.lastX = e.clientX;
  focusDragAccum = 0;   // 每次按下重新累计，避免两次拖动手势叠加误触发
});
core.renderer.domElement.addEventListener('pointermove', function (e) {
  if (state.downX != null && Math.hypot(e.clientX - state.downX, e.clientY - state.downY) > 6) state.dragged = true;
  if (!isTouchEnv()) {
    state.nx = (e.clientX / innerWidth) * 2 - 1;
    state.ny = (e.clientY / innerHeight) * 2 - 1;
  }
  // 触摸手势统一交给 initTouchExtras / initInput，避免与鼠标拖动逻辑重复触发
  if (e.pointerType === 'touch') return;
  var dx = e.clientX - state.lastX; state.lastX = e.clientX;
  // 鉴赏模式：按住左键左右拖动 → 走马灯式切换上一张 / 下一张
  if (state.isDown && state.downBtn === 0 && focusChar) {
    focusDragAccum += dx;
    if (focusDragAccum >= 70) { focusDragAccum = 0; stepFocus(1); }
    else if (focusDragAccum <= -70) { focusDragAccum = 0; stepFocus(-1); }
    return;
  }
  // 巡航模式：左键按住并左右拖动 → 滑动浏览画廊（scrub 巡航），并累积"波动"幅度
  if (state.isDown && state.downBtn === 0 && rig.mode === 'cruise') {
    rig.u = (rig.u - dx * 0.0011 + 1) % 1;
    rig.lastScrub = performance.now();
    gWave = Math.max(-1, Math.min(1, gWave + dx * 0.02));
  }
});
core.renderer.domElement.addEventListener('pointerup', function (e) {
  state.isDown = false;
  if (e.button !== 0) return;          // 仅左键触发鉴赏，右键交给 contextmenu
  if (state.dragged) return;
  if (SHUF.active) return;             // 洗牌特效进行中不响应拾取
  if (performance.now() < suppressTapUntil) return;   // 双击已处理本次点击
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  var hits = raycaster.intersectObjects(clickTargets, false);
  for (var i = 0; i < hits.length; i++) {
    var o = hits[i].object;
    if (o.userData.isOrb) {
      var c = orbTrigger.tap(performance.now() / 1000);
      if (c > 0 && c < 3) UI.setMode('机关启动 ' + c + '/3 …');
      return;
    }
    if (o.userData.char) {
      if (o.userData.char.kind === 'villain' && !vault.group.visible) continue;
      openFocus(o.parent, o.userData.char);
      return;
    }
  }
  if (focusChar) exitFocus();
});
// 右键：翻转卡片查看背面信息
core.renderer.domElement.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  var hits = raycaster.intersectObjects(clickTargets, false);
  for (var i = 0; i < hits.length; i++) {
    var o = hits[i].object;
    if (o.userData.char) {
      var grp = o.parent;
      setCardFlipped(grp, !grp.userData.flipped);
      UI.setMode(grp.userData.flipped ? '翻转 · 查看背面（再右键翻回）' : (focusChar ? '鉴赏 · ' + focusChar.name : '自动导览中'));
      return;
    }
  }
});
// 滚轮：上下滚动也可滑动浏览
core.renderer.domElement.addEventListener('wheel', function (e) {
  if (rig.mode === 'cruise') {
    rig.u = (rig.u + (e.deltaY > 0 ? 0.012 : -0.012) + 1) % 1;
    rig.lastScrub = performance.now();
  }
}, { passive: true });

function isTouchEnv() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;
}
initInput(core.renderer.domElement, state);

/* ---------- 移动端增强 ---------- */
/* ① 双击卡片 = 翻面（手机无右键，替代电脑端的右键翻转）
 * ② 鉴赏模式下手指左右滑动 = 电脑端 ←/→ 走马灯切换上一张 / 下一张 */
(function initTouchExtras(canvas) {
  var TAP_GAP = 340;      // 双击判定时间窗（ms）
  var TAP_SLOP = 28;      // 双击两次落点允许偏移（px）
  var SWIPE_STEP = 55;    // 滑动多少 px 切换一张
  var lastTapT = 0, lastTapX = 0, lastTapY = 0;
  var startX = 0, startY = 0, moved = false, tracking = false;

  function pickCard(cx, cy) {
    pointer.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(clickTargets, false);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      if (!o.userData.char) continue;
      if (o.userData.char.kind === 'villain' && !vault.group.visible) continue;
      return o.parent;
    }
    return null;
  }

  canvas.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    moved = false; tracking = true;
  }, { passive: true });

  canvas.addEventListener('touchmove', function (e) {
    if (!tracking || e.touches.length !== 1) return;
    var t = e.touches[0];
    var dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) moved = true;
    // 鉴赏模式：手指左右滑动 → 切换下一张 / 上一张（左滑看下一张）
    if (focusChar && Math.abs(dx) >= SWIPE_STEP) {
      stepFocus(dx < 0 ? 1 : -1);
      startX = t.clientX; startY = t.clientY;   // 重置基准，支持连续滑
    }
  }, { passive: true });

  canvas.addEventListener('touchend', function (e) {
    tracking = false;
    if (moved || e.changedTouches.length !== 1) return;
    var t = e.changedTouches[0], now = performance.now();
    if (now - lastTapT < TAP_GAP &&
        Math.hypot(t.clientX - lastTapX, t.clientY - lastTapY) < TAP_SLOP) {
      var grp = pickCard(t.clientX, t.clientY);
      if (grp) {
        setCardFlipped(grp, !grp.userData.flipped);
        UI.setMode(grp.userData.flipped
          ? '翻转 · 查看背面（再双击翻回）'
          : (focusChar ? '鉴赏 · ' + focusChar.name : '自动导览中'));
        suppressTapUntil = now + 420;    // 抑制随后合成的单击，避免重复聚焦
      }
      lastTapT = 0;
      return;
    }
    lastTapT = now; lastTapX = t.clientX; lastTapY = t.clientY;
  }, { passive: true });
})(core.renderer.domElement);

addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (inVault) exitVault(); else exitFocus();
  }
  if (e.key === '1') switchLayout('dualRing');
  if (e.key === '2') switchLayout('islands');
  if (e.key === '3') switchLayout('corridor');
  // R 键：星穹洗牌（打乱 → 重组）
  if (e.key === 'r' || e.key === 'R') startShuffle();
  // 鉴赏模式：左右方向键切换上一张 / 下一张
  if (focusChar && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    e.preventDefault();
    stepFocus(e.key === 'ArrowRight' ? 1 : -1);
  }
});

/* ---------- 鉴赏 / 密室 ---------- */
function openFocus(grp, char) {
  focusChar = char;
  focusGrp = grp;
  focusList = (char.kind === 'villain') ? villainCards : heroCards;
  focusDragAccum = 0;
  UI.openPanel(char);
  // 用卡片基准朝向（不受翻转影响）定位相机，避免翻转后相机穿到卡内
  var normal = new THREE.Vector3(0, 0, 1).applyQuaternion(grp.userData.targetQuat);
  var pos = grp.position.clone().addScaledVector(normal, 9.5);
  pos.y += 0.6;
  rig.focus(pos, grp.position.clone());
}
/* 鉴赏模式：走马灯式切换上一张 / 下一张（dir = 1 下一张，-1 上一张），首尾循环 */
function stepFocus(dir) {
  if (!focusGrp || !focusList.length) return;
  var i = focusList.indexOf(focusGrp);
  if (i < 0) return;
  setCardFlipped(focusGrp, false);   // 切走前把当前卡翻回正面
  var next = focusList[(i + dir + focusList.length) % focusList.length];
  openFocus(next, next.userData.char);
}
function exitFocus() {
  focusChar = null;
  focusGrp = null;
  focusList = [];
  focusDragAccum = 0;
  UI.closePanel(inVault ? '恶人密室' : '自动导览中');
  rig.release();
  resetAllFlips();          // 退出鉴赏回到全景，卡片翻回正面
}
function enterVault() {
  inVault = true;
  vault.open();
  scene.fog.color.setHex(0x2a0a10);      // 密室：暗红雾
  scene.fog.density = 0.010;
  rig.focus(vault.enterPos, vault.enterLook);
  UI.setMode('恶人密室');
  UI.showEntryBtn(false);
  document.getElementById('exitVaultBtn').style.display = '';
}
function exitVault() {
  inVault = false;
  vault.close();
  scene.fog.color.setHex(0x060614);      // 主馆：深空蓝雾
  scene.fog.density = 0.0052;
  exitFocus();
  rig.release();
  UI.setMode('自动导览中');
  document.getElementById('exitVaultBtn').style.display = 'none';
}
document.getElementById('exitVaultBtn').addEventListener('click', exitVault);

/* ---------- 主循环 ---------- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  var rawDt = clock.getDelta();          // 真实帧间隔（布局过渡用，低帧率下更快到位）
  var dt = Math.min(rawDt, 0.05);        // 相机与动画用（避免跳变）
  var t = clock.elapsedTime;

  if (state.pinch) {
    camera.fov = Math.max(40, Math.min(70, camera.fov - state.pinch));
    camera.updateProjectionMatrix();
    state.pinch = 0;
  }

  rig.update(dt, state.nx, state.ny);
  if (SHUF.active) {
    updateShuffle(t);                 // 洗牌期间由特效全权接管卡片位姿
  } else {
    layoutManager.update(rawDt, t);

    var kc = 1 - Math.exp(-dt * 1.8);
    villainCards.forEach(function (grp) {
      var d = grp.userData;
      grp.position.y = d.baseY + Math.sin(t * 0.7 + d.phase) * 0.22;
      grp.quaternion.slerp(effectiveQuat(d, t), kc);
    });
  }

  for (var i = 0; i < holoMats.length; i++) holoMats[i].uniforms.uTime.value = t;
  stele.group.rotation.y = t * 0.12;
  stele.glow.material.opacity = 0.55 + Math.sin(t * 1.6) * 0.12;
  gWave *= 0.92;                          // 滑动波动幅度逐帧衰减

  render();
}
animate();

addEventListener('resize', resize);

/* 调试钩子（无副作用） */
window.__HALL = {
  get layout() { return currentLayout; },
  get craft() { return currentCraft; },
  get vault() { return inVault; },
  switchLayout: switchLayout,
  switchCraft: switchCraft,
  cardPos: function (n) { return heroCards[n - 1].position.toArray().map(function (v) { return v.toFixed(1); }).join(','); },
  targetPos: function (n) { return heroCards[n - 1].userData.targetPos.toArray().map(function (v) { return v.toFixed(1); }).join(','); },
  movingCount: function () { return heroCards.filter(function (g) { return g.userData.moving; }).length; },
  unlockVault: function () { orbTrigger.unlocked = true; UI.setMode('密室已开启 · 点击右下角进入'); UI.showEntryBtn(true); return 'unlocked'; },
  shuffle: startShuffle,
  shuffling: function () { return SHUF.active; },
  enterVault: enterVault,
  exitVault: exitVault
};
})();
