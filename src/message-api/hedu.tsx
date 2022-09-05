import {
    AsyncButtonComponent,
    declareModule,
    makeUserInterfaceModule,
    React,
    UserInterfaceElementPlace,
} from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';
import { problem1 } from './heduContent';

declareModule(
    makeUserInterfaceModule({
        manifest: {
            name: '@systems/messages-api-hedu',
            // TODO: Temporarirly disabled due to multiple scopes from one package error> name: '@hedu/test-message-api',
            version,
            description,
            contributors,
            license,
            repository,
            title: 'Create board with H-edu problem',
            flags: {
                isHidden: true,
            },
        },
        place: UserInterfaceElementPlace.EdgeTop,
        async createElement(systems) {
            await systems.request('messagesApiSystem');

            return (
                <AsyncButtonComponent
                    alt="sending a message"
                    className="button button-primary modal-button"
                    onClick={async () => {
                        window.postMessage({
                            type: 'REQUEST',
                            systemName: 'boardSystem',
                            actionName: 'createNewBoard',
                            boardname: 'Odpovězte Milošovi',
                            useTemplate: problem1,
                            modulesOn: ['@collboard/hedu-color-attribute', '@collboard/hedu-tray-tool'],
                            modulesOff: ['@collboard/eu-cookies-warning', '@collboard/board-name'],
                            isNewBoardNavigated: true,
                            isPersistent: false,
                        });
                    }}
                >
                    Create board with H-edu problem
                </AsyncButtonComponent>
            );
        },
    }),
);
