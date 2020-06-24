import { EMPTY, of, ReplaySubject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { nameToStrategy } from './nameToStrategy';
/**
 * RenderAware
 *
 * @description
 * This function returns an object that holds all the shared logic for the push pipe and the let directive
 * responsible for change detection
 * If you extend this class you need to implement how the update of the rendered value happens.
 * Also custom behaviour is something you need to implement in the extending class
 */
export function createRenderAware(cfg) {
    const strategyName$ = new ReplaySubject(1);
    const strategy$ = strategyName$.pipe(distinctUntilChanged(), switchMap(stringOrObservable => typeof stringOrObservable === 'string'
        ? of(stringOrObservable)
        : stringOrObservable), nameToStrategy(cfg.strategies));
    const observablesFromTemplate$ = new ReplaySubject(1);
    const valuesFromTemplate$ = observablesFromTemplate$.pipe(distinctUntilChanged());
    let firstTemplateObservableChange = true;
    const renderingEffect$ = valuesFromTemplate$.pipe(
    // handle null | undefined assignment and new Observable reset
    map(observable$ => {
        if (observable$ === null) {
            return of(null);
        }
        if (!firstTemplateObservableChange) {
            cfg.resetObserver.next();
            if (observable$ === undefined) {
                return of(undefined);
            }
        }
        firstTemplateObservableChange = false;
        return observable$;
    }), 
    // forward only observable values
    filter(o$ => o$ !== undefined), switchMap(o$ => o$.pipe(distinctUntilChanged(), tap(cfg.updateObserver))), withLatestFrom(strategy$), tap(([v, strat]) => strat.scheduleCD()), catchError(e => {
        console.error(e);
        return EMPTY;
    }));
    return {
        nextPotentialObservable(value) {
            observablesFromTemplate$.next(value);
        },
        nextStrategy(nextConfig) {
            strategyName$.next(nextConfig);
        },
        activeStrategy$: strategy$,
        subscribe() {
            return new Subscription()
                .add(strategy$.subscribe())
                .add(renderingEffect$.subscribe());
        }
    };
}
//# sourceMappingURL=render-aware_creator.js.map