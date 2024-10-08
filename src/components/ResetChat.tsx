import { useEffect } from 'react';
import '../styles.css';
import { useTranslation } from 'react-i18next'; // 翻訳機能を使うためのライブラリ
interface Props {
    showResetModal: boolean; // モーダルの表示状態を管理するブール値
    setShowResetModal: (value: boolean) => void; // モーダルの表示/非表示をBooleanで管理する関数
    setMessages: (value: []) => void; // メッセージ履歴をリセットするための関数
    setInput: (value: string) => void; // 入力フォームの内容をリセットするための関数
    reshuffleButtonTexts: () => void; // ボタンのテキストをもう一度シャッフルする関数（chat.tsxの関数reshuffleButtonTextsを実行）
}

const ResetChat = ({ showResetModal, setShowResetModal, setMessages, setInput, reshuffleButtonTexts }: Props) => {

    // useTranslationフックでt関数を取得
    // このt関数を使って、翻訳したい文字列のキーをt関数の引数に渡すことで、翻訳された文字列を取得できる
    const { t } = useTranslation();

    const handleReset = () => {
        setMessages([]); // メッセージ履歴を空にする
        setInput(''); // 入力フォームの内容を空にする
        reshuffleButtonTexts(); // ボタンのテキストをもう一度シャッフルする
        setShowResetModal(false); // モーダルウィンドウを閉じる
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { // キー入力され、それがEscキーなら、setShowResetModalをfalseにしてモーダルウィンドウを閉じる
            if (e.key === 'Escape') {
                setShowResetModal(false);
            }
        };
        window.addEventListener('keydown', handleEsc); // キー入力された時にhandleEscを実行

        return () => {
            window.removeEventListener('keydown', handleEsc);
        }; // windowオブジェクトからkeydownイベントを削除し、handleEsc関数がこれ以上呼び出されないようにする。
    }, [setShowResetModal]); // setShowResetModalが変更された時にuseEffectを実行

    return (
        <>
            <div
                className={`modal`}
                style={{ display: showResetModal ? 'block' : 'none' }} // もし、showResetModalがtrueならモーダルウィンドウを表示
                data-bs-backdrop="true" // モーダルウィンドウの背景をクリックしたらモーダルウィンドウが閉じるようにする。
                data-bs-keyboard="true" // キーボードのEscキーを押すとモーダルウィンドウが閉じるようにする。
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowResetModal(false);
                    }
                }} // モーダルウィンドウの背景をクリックしたらモーダルウィンドウが閉じるようにする。

            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content" style={{ borderRadius: '40px', backgroundColor: '#f5f8ef', color: '#001d0b' }}>
                        <div className="modal-header border-bottom-0"> {/* モーダルウィンドウのヘッダー */}
                            <h5 className="fs-2 mt-3 ms-3">{t('reset_chat')}</h5>
                        </div>
                        <div className="modal-body"> {/* モーダルウィンドウのボディ */}
                            <p className="fs-4 ms-3">{t('reset_chat_confirm')}</p>
                        </div>
                        <div className="modal-footer border-top-0 d-flex justify-content-end"> {/* モーダルウィンドウのフッター */}
                            <button
                                type="button"
                                className="btn btn-cancel fs-2 mb-3 me-1"
                                style={{ borderRadius: '20px', color: '#001d0b' }}
                                onClick={() => setShowResetModal(false)}> {/* キャンセルボタンを押すとshowResetModalがfalseになりモーダルウィンドウが閉じる */}
                                {t('cancel')}
                            </button> {/* キャンセルボタンを押すとshowResetModalがfalseになりモーダルウィンドウが閉じる */}
                            <button
                                type="button"
                                className="btn btn-danger fs-2 mb-3 ms-1 me-3"
                                style={{ borderRadius: '20px' }}
                                onClick={handleReset}> {/* リセットボタンを押すとChat.tsxのhandleResetが実行されて配列messages(会話の履歴)とinput(入力フォーム)の中身が空になる */}
                                {t('reset')}
                            </button> {/* リセットボタンを押したらhandleResetが実行されて配列messages(会話の履歴)とinput(入力フォーム)の中身が空になる */}
                        </div>
                    </div>
                </div>
            </div>
            {showResetModal && <div className="modal-backdrop show"></div>}
        </>
    );
};

export default ResetChat;
