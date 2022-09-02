import { AsyncButtonComponent, React } from '@collboard/modules-sdk';
import { MessageApiStyle } from './MessageApiStyle';

export function MessageApiComponent() {
    // const { messagesApiSystem } = useSystems('messagesApiSystem');
    const textarea = React.useRef<HTMLTextAreaElement>(null);

    return (
        <MessageApiStyle>
            <textarea className="request" ref={textarea}>
                {JSON.stringify(
                    {
                        type: 'REQUEST',
                        systemName: 'boardSystem',
                        actionName: 'createNewBoard',
                        boardname: 'test',
                        //useTemplate: 'https://collboard.com/gu4u374qkv7jjvqecpro',
                        useTemplate: `data:text/html,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E`,
                        //modulesOn: '@hejny/foo',
                        //modulesOff: ['@collboard/foo', '@collboard/bar'],
                        isNewBoardNavigated: true,
                        isPersistent: false,
                    },
                    null,
                    4,
                )}
            </textarea>
            <AsyncButtonComponent
                alt="sending a message"
                className="button button-primary modal-button"
                /* <- <Clickable vs. <Button vs. (deprecated <AsyncButtonComponent) */ onClick={async () => {
                    const message = JSON.parse(textarea.current!.textContent!);
                    window.postMessage(message);

                    // !!! Use here await messagesApiSystem.sendMessage;
                }}
            >
                Post
            </AsyncButtonComponent>
            <hr />
            <pre className="response">Response</pre>
        </MessageApiStyle>
    );
}

/**
 * TODO: Use rich editor (with schema parser) like ace instead of textarea
 */
