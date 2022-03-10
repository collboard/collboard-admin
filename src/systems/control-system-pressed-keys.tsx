import {
    declareModule,
    ExtraJsxPlace,
    IKey,
    IShortcut,
    ObservableContentComponent,
    React,
    styled,
} from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { forTime } from 'waitasecond';
import { contributors, license, repository, version } from '../../package.json';

declareModule({
    manifest: {
        name: '@systems/control-system',
        version,
        icon: `🎹`,
        title: {
            en: 'Show pressed keys',
            cs: 'Zobrazení stisknutých kláves',
        },
        /*description:{
              en: '',
              cs: '',
            },*/
        contributors,
        license,
        repository,
    },
    async setup(systems) {
        const { controlSystem, extraJsxSystem } = await systems.request('controlSystem', 'extraJsxSystem');

        const wheelControls = new BehaviorSubject<IShortcut>([]);

        // !!! Add everything to registration
        Registration.createEventListener({
            element: window.document,
            type: 'wheel',
            listener: (event: WheelEvent) => {
                /*
              !!!
              if (!isEventOnBoard(event)) {
                  return;
              }
              */

                async function add(key: IKey) {
                    wheelControls.next([key]);
                    //await forAnimationFrame();
                    await forTime(500);
                    wheelControls.next(wheelControls.value.filter((pressedKey) => pressedKey !== key));
                }

                if (event.deltaY > 0) {
                    add('WheelDown');
                } else if (event.deltaY < 0) {
                    add('WheelUp');
                }

                if (event.deltaX > 0) {
                    add('WheelRight');
                } else if (event.deltaX < 0) {
                    add('WheelLeft');
                }

                event.preventDefault();
            },
            options: { passive: false },
        });

        const pressedControls: Observable<IShortcut> = combineLatest(controlSystem.pressedKeys, wheelControls).pipe(
            map((controls) => controls.flat()),
        );

        return extraJsxSystem.register({
            order: -100,
            place: ExtraJsxPlace.RootComponent,
            jsx: (
                <ObservableContentComponent
                    alt="Currently pressed keys"
                    content={pressedControls.pipe(
                        map((pressedControlsValue) => {
                            return (
                                <Shortcut>
                                    {pressedControlsValue.map((key, i) => (
                                        <>
                                            <Key key={key}>{displayKey(key)}</Key>
                                            {i !== pressedControlsValue.length - 1 && <Separator>+</Separator>}
                                        </>
                                    ))}
                                </Shortcut>
                            );
                        }),
                    )}
                />
            ),
        });
    },
});

const KEY_NAMES: Partial<Record<IKey, string>> = {
    Control: 'Ctrl',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    WheelUp: '🖰↑',
    WheelDown: '🖰↓',
    WheelLeft: '←🖰',
    WheelRight: '🖰→',
};

function displayKey(key: IKey): string {
    if (KEY_NAMES[key]) {
        return KEY_NAMES[key]!;
    } else {
        return key.substring(0, 1).toUpperCase() + key.substring(1);
    }
}

const Shortcut = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0.8;

    font-size: 3em;

    color: #000;
`;

const Key = styled.div`
    display: inline-block;

    margin: 0.5rem;
    padding: 0.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 3px;
    background-color: #000;
    color: #fff;

    /*&:not(:last-child):after {
        content: ' +';
    }*/
`;

const Separator = styled.div``;

/**
 * TODO: Fade out
 */
