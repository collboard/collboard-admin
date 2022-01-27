import { declareModule, makeModalModule, React, styled } from '@collboard/modules-sdk';
import { spaceTrim } from 'spacetrim';
import { v4 } from 'uuid';
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
            title: 'IdentitySystem',
            flags: {
                isHidden: true,
            },
        },
        async createModal(systems) {
            const { identitySystem, routingSystem } = await systems.request('identitySystem', 'routingSystem');

            const instanceIdentity = identitySystem.createInstanceIdentity();

            return (
                <>
                    {Object.entries(instanceIdentity).map(([key, value]) => (
                        <Value {...{ key }}>
                            <b className="col key">{key}: </b>
                            <span className="col value">{value || 'none'}</span>
                            <span className="col actions">
                                {key === 'browserId' && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                if (
                                                    !confirm(
                                                        spaceTrim(`
                                                          Do you really want to change your browserId.
                                                          You will loose all your boards connected with this browser!
                                                        `),
                                                    )
                                                ) {
                                                    return;
                                                }

                                                const browserId = prompt(
                                                    spaceTrim(`

                                                      Please enter a new browserId.

                                                      Current browserId: ${value}
                                                      Note: There is prefilled random sample:

                                                    `),
                                                    v4(),
                                                );

                                                if (
                                                    !browserId ||
                                                    !/^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/.test(
                                                        browserId,
                                                    )
                                                ) {
                                                    alert(`BrowserId must be a valid UUID.`);
                                                    return;
                                                }

                                                localStorage.removeItem(`clientId`);
                                                localStorage.removeItem(`Collboard_ApiClientCache_getMyBoards`);
                                                localStorage.removeItem(`Collboard_IdentitySystem_clientId`);
                                                localStorage.removeItem(`Collboard_IdentitySystem_clientUuid`);

                                                await (identitySystem as any).storage.setItem(`clientId`, browserId);

                                                alert(
                                                    spaceTrim(`
                                                      BrowserId successfully changed!
                                                      Now it's ${browserId}

                                                      Redirecting to homepage...

                                                    `),
                                                );

                                                window.location.href = routingSystem.homeUrl.href;
                                            }}
                                        >
                                            Change
                                        </button>
                                    </>
                                )}
                            </span>
                        </Value>
                    ))}
                </>
            );
        },
    }),
);

const Value = styled.div`
    border-bottom: 1px solid #eee;
    padding: 10px;

    .col {
        display: inline-block;
    }

    .key {
        width: 100px;
    }
`;
