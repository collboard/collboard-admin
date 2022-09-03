import { declareModule, makeModalModule, React } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';
import { MessageApiComponent } from './MessageApiComponent';

declareModule(
    makeModalModule({
        manifest: {
            name: '@systems/messages-api',
            // TODO: Temporarirly disabled due to multiple scopes from one package error> name: '@admin/message-api',
            version,
            description,
            contributors,
            license,
            repository,
            title: 'Message API console',
            flags: {
                isHidden: true,
            },
        },
        async createModal(systems) {
            await systems.request('messagesApiSystem');

            return <MessageApiComponent />;
        },
    }),
);
