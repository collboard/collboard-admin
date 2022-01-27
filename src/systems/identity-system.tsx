import { declareModule, makeModalModule, React, styled } from '@collboard/modules-sdk';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';

declareModule(
    makeModalModule({
        manifest: {
            name: '@systems/identity-system',
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Sample button' },
            categories: ['Productivity', 'Buttons', 'Template'],
            icon: helloWorldIcon,
            flags: {
                isTemplate: true,
            },
        },
        async createModal(systems) {
            const { identitySystem } = await systems.request('identitySystem');

            const { browserId, sessionId } = identitySystem;
            return (
                <>
                    <Value>
                        <b>browserId: </b>
                        {browserId}
                    </Value>
                    <Value>
                        <b>sessionId: </b>
                        {sessionId}
                    </Value>
                </>
            );
        },
    }),
);

const Value = styled.div`
    background-color: #906090;
`;
