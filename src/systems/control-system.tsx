import { declareModule, makeModalModule, ObservableContentComponent, React, styled } from '@collboard/modules-sdk';
import { map } from 'rxjs/operators';
import { contributors, description, license, repository, version } from '../../package.json';

declareModule(
    makeModalModule({
        manifest: {
            name: '@systems/control-system',
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
            const { controlSystem } = await systems.request('controlSystem');
            return (
                <ul>
                    <ObservableContentComponent
                        alt="All registered shortcuts"
                        content={controlSystem.controls.pipe(
                            // TODO: Use here map pipe util from collboard
                            map((controls) =>
                                controls.map(({ defaultShortcut }) => (
                                    <li key={defaultShortcut.join('+')}>
                                        <Shortcut>
                                            {defaultShortcut.map((key) => (
                                                <Key key={key}>{key}</Key>
                                            ))}
                                        </Shortcut>
                                    </li>
                                )),
                            ),
                        )}
                    />
                </ul>
            );
        },
    }),
);

const Shortcut = styled.div``;

const Key = styled.div`
    display: inline-block;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 3px;
    background-color: #666;
    color: #fff;
`;


/**
 * TODO: Allow to override the shortcuts
 */
