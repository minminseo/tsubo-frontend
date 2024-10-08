import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, RefreshCw, MessageCircle } from 'lucide-react';
import ResetChat from './ResetChat';
import axios from 'axios';
import '../styles.css';
import { useTranslation } from 'react-i18next';

interface Message {
    text: string;
    isUser: boolean;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]); // メッセージの内容と、その時のmessageの中身がユーザーかどうかを判別するための状態変数
    const [input, setInput] = useState(''); // ユーザーが入力したテキストを管理するための状態変数
    const messagesEndRef = useRef<HTMLDivElement>(null); // チャットが更新されたときに最後のメッセージまでスクロールするためのref
    const [showResetModal, setShowResetModal] = useState(false); // リセットボタンをクリックした時に表示されるモーダルウィンドウの表示状態を管理するための状態変数
    const [buttonTexts, setButtonTexts] = useState<string[]>([]); // サンプルの症状を表示するためのテキストを管理するための状態変数
    const [isLoading, setIsLoading] = useState(false); // ツボ情報のレスポンスまでの間にローディングアイコンを表示するための状態変数
    const { t } = useTranslation(); // i18nのt関数をtとして使用

    // チャット画面初期状態のランダムに表示される症状サンプルのあつまり
    const symptomsSample = useMemo(() => [
        t("headache"),
        t("stomach_ache"),
        t("muscle_pain"),
        t("sleepy"),
        t("eye_strain"),
        t("shoulder_stiffness"),
        t("back_pain"),
        t("stomach_pain"),
        t("cold_symptoms"),
        t("stress"),
        t("constipation"),
        t("mouth_ulcer"),
        t("knee_pain"),
        t("hangover"),
        t("cold_hands"),
        t("swollen_feet"),
        t("tinnitus"),
        t("menstrual_pain"),
        t("runny_nose"),
        t("itchy_skin")
    ], [t]);

    // 配列symptomsSampleからランダムにcount個(4個)の症状を選んで返す関数
    const shuffleAndSelectSymptoms = (symptomsSample: string[], count: number): string[] => {
        const shuffled = [...symptomsSample].sort(() => 0.5 - Math.random()); // [...symptomsSample]はsymptomsSampleのコピーを作成し、.sort(() => 0.5 - Math.random());で配列をランダムにシャッフル
        return shuffled.slice(0, count); // slice(0, count)で先頭からcount個(4個)の要素を取得
    };

    // 初回レンダリング時に症状サンプルをランダムに表示(shuffleAndSelectSymptoms関数を実行)
    useEffect(() => {
        setButtonTexts(shuffleAndSelectSymptoms(symptomsSample, 4));
        console.log('確認');
    }, [symptomsSample]);

    // リセットボタンクリック時に症状サンプルを再度ランダムに表示(shuffleAndSelectSymptoms関数を実行)
    const reshuffleButtonTexts = () => {
        setButtonTexts(shuffleAndSelectSymptoms(symptomsSample, 4));
    };

    // messageが変わったらメッセージの終わりにスクロールさせる処理
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* 送信方法は2パターン（送信ボタンクリック or エンターキー）
    以下は送信ボタンをクリックした時 or エンターキー押したことにより関数handleKeyPressが実行され、
    この関数内でhandleSendが実行された時の処理。
    inputが空でなければmessagesに新しいメッセージを追加し、バックエンドにinputを送信して返事を受け取る。
    */
    const handleSend = async (message: string) => {
        if (message.trim()) { // trimで余計な空白を削除
            setMessages(prev => [...prev, { text: message, isUser: true }]); // isUserをtrueにすることでユーザーのメッセージとして表示
            setInput(''); // メッセージを送信したら入力フォームを空にする
            setIsLoading(true); // ローディングアイコンを表示

            try {
                const response = await axios.post('http://127.0.0.1:8080/process_message', { message });  // エンドポイントをprocess_messageに設定
                setMessages(prev => [...prev, { text: response.data.response, isUser: false }]);  // バックエンドからの返事のisUserをfalseにすることで返事のメッセージとして表示
            } catch (error) {
                console.error('Error:', error);
                setMessages(prev => [...prev, { text: t('error_message'), isUser: false }]);
            } finally {
                setIsLoading(false); 
            }
        }
    };

    // エンターキーを押した時の処理
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend(input);
        }
    };

    return (
        <> {/* d-flexで flexboxを使い、flex-columnで縦方向に要素を並べる。 */}
            <div className="d-flex flex-column h-100">

                {/* ここから会話の表示部分 */}
                <div className="flex-grow-1 overflow-auto p-5" style={{ backgroundColor: '#f5f8ef' }}>
                    {/* 配列messagesの要素数(メッセージ数)が0の時と0以外の時でブロックを分ける。他に良い書き方があるか調べる。 */}
                    {messages.length === 0 ? (
                        <div
                            className="d-flex container align-items-center justify-content-center flex-column h-100 animated-element3"
                            style={{ color: '#001d0b' }}>
                            <div className="display-6 mb-5" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                            {t('tell_me_symptom')}
                            </div>
                            <div>
                                {/* 症状サンプルを表示するボタン。ボタンをクリックするとhandleSend関数が実行されて、そのボタンのテキストがhandleSend関数に渡される。 */}
                                {buttonTexts.map((text, index) => (
                                    <button
                                        key={index}
                                        className="btn m-1"
                                        style={{ border: '1px solid #c0c0c0', backgroundColor: '#f8fbf2', height: '100px', width: '250px' }}
                                        onClick={() => handleSend(text)} // ここでhandleSend関数を実行して、ボタンのテキストを引数として渡す
                                    >
                                        <div className="d-flex justify-content-start mb-3 ms-2" style={{ color: 'gray' }}>
                                            <MessageCircle size={20} />
                                        </div>
                                        <div className="d-flex justify-content-start ms-2 fs-6" style={{ color: '#001d0b' }}>
                                            {text}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                /* 配列messageをループ処理して1列ずつ要素(メッセージ)を表示するためのコンテナを表示していく。
                                message.isUserが
                                trueなら右端(justjify-content-end)に要素を表示して、
                                falseなら左端(justify-content-start)に要素表示することで、
                                ユーザーのメッセージと返事のメッセージを区別できるようにする。
                                */
                                <div className="container" style={{ maxWidth: '1500px' }}>
                                    <div key={index} className={`d-flex ${message.isUser ? 'justify-content-end' : 'justify-content-start'} mb-5`}>
                                        <div
                                            /* メッセージの見た目を定義。
                                            ユーザー→bg-success text-white
                                            返事→bg-white
                                            */
                                            className={`p-3 ${message.isUser ? 'custom-success text-black' : 'bg-white'}`}
                                            style={{
                                                maxWidth: '80%',
                                                fontSize: '1.4rem',
                                                borderRadius: '15px',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* ローディングアイコン */}
                            {isLoading && (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} /> {/* 送信と同時に自動で最後のメッセージまでスクロールする */}
                </div>
                {/* ここまで会話の表示部分 */}


                {/* ここから入力部分 */}
                <div style={{ backgroundColor: '#f5f8ef' }}>
                    <div className='m-3'>
                        <div className="p-3 border-top animated-element1 d-flex container"
                            style={{
                                backgroundColor: '#cbddb1',
                                width: '80%',
                                borderRadius: '20px'
                            }}>
                            <div className="d-flex  align-items-center container">
                                {/* リセットボタン */}
                                <button
                                    className={`btn d-flex justify-content-start align-items-center border-0 animated-element2 ${messages.length === 0 ? 'bg-secondary text-light' : 'bg-success text-light'}`}
                                    style={{ height: '3rem', width: '3rem', flexShrink: 0 }}
                                    disabled={messages.length === 0} // 配列messagesが空の時はリセットボタンを無効化
                                    onClick={() => setShowResetModal(true)} // ここでshowResetModalをtrueにすることでResetChat.tsxでdisplayにblockを適用し、モーダルウィンドウを表示
                                >
                                    <RefreshCw />
                                </button>

                                {/* 入力フォーム */}
                                <div className="flex-grow-1 mx-3 justify-content-center animated-element2">
                                    <input
                                        type="text"
                                        className="form-control border-0"
                                        style={{
                                            height: '50px',
                                            fontSize: '1.5rem',
                                            paddingLeft: '1rem',
                                            paddingRight: '1rem',
                                            width: '100%',
                                            backgroundColor: '#cbddb1',
                                            outline: 'none',
                                            boxShadow: 'none'
                                        }}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress} // ※onKeyPressを使わずにエンターキー送信できるように要修正
                                        placeholder={t('send_symptom')}
                                    />
                                </div>

                                {/* 送信ボタン */}
                                <button
                                    className={`btn d-flex justify-content-end align-items-center border-0 animated-element2 ${input.trim() ? 'bg-success text-light' : 'bg-secondary text-light'}`}
                                    style={{ height: '3rem', width: '3rem', flexShrink: 0 }}
                                    onClick={() => handleSend(input)}
                                    disabled={!input.trim() || isLoading} // 入力フォームが空の時は送信ボタンを無効化 or ローディング中は無効化
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ここまで入力部分 */}
            </div>

            {/* リセットボタンクリック時にひらくモーダルウィンドウ */}
            <ResetChat // showResetModalがtrueの時に表示されるコンポーネント(モーダルウィンドウ)
                showResetModal={showResetModal} // showResetModalの値をshowResetModalに渡してPropsとしてResetChat.tsxに渡す(モーダルウィンドウの表示状態を制御するための状態変数を渡している)
                setShowResetModal={setShowResetModal} // 関数setShowResetModalをsetShowResetModalに渡してPropsとしてResetChat.tsxに渡す(モーダルウィンドウの表示状態を更新するための関数を渡している)
                setMessages={setMessages} // 関数setMessagesをsetMessagesに渡してPropsとしてResetChat.tsxに渡す(メッセージの内容を更新するための関数を渡している)
                setInput={setInput} // 関数setInputをsetInputに渡してPropsとしてResetChat.tsxに渡す(入力フォームの内容を更新するための関数を渡している)
                reshuffleButtonTexts={reshuffleButtonTexts} // 関数reshuffleButtonTextsをreshuffleButtonTextsに渡してPropsとしてResetChat.tsxに渡す(症状サンプルを再度ランダムに表示するための関数を渡している)
            />
        </>
    );
};

export default Chat;

