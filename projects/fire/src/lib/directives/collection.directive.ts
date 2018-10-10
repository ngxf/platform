import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef, EmbeddedViewRef, SimpleChanges, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, QueryFn } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

enum FireCollectionStrategies {
    UsePath,
    UseRef
}

interface FireCollectionStrategy {
    type: FireCollectionStrategies;
    changes: string[];
    require: string[];
}

interface FireCollectionContext {
    $implicit: AngularFirestoreCollection<any>;
    collection: AngularFirestoreCollection<any>;
}

const COLLECTION_CONFIG: FireCollectionStrategy[] = [
    {
        type: FireCollectionStrategies.UsePath,
        changes: ['fireCollectionPath', 'fireCollectionQueryFn'],
        require: ['fireCollectionPath']
    },
    {
        type: FireCollectionStrategies.UseRef,
        changes: ['fireCollectionRef', 'fireCollectionQueryFn'],
        require: ['fireCollectionRef']
    }
];

@Directive({ selector: 'fireCollection' })
export class FireCollectionDirective implements OnChanges, OnDestroy {
    @Input() fireCollectionPath: string;
    @Input() fireCollectionRef: CollectionReference;
    @Input() fireCollectionQueryFn: QueryFn;
    @Input() fireCollectionSubscribe: string;

    private collection: AngularFirestoreCollection<any>;
    private context: FireCollectionContext = {
        $implicit: null,
        get collection() { return this.$implicit; }
    };
    private viewRef: EmbeddedViewRef<FireCollectionContext> =
        this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
    private subscription: Subscription;

    constructor(
        private afs: AngularFirestore,
        private templateRef: TemplateRef<FireCollectionContext>,
        private viewContainerRef: ViewContainerRef
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        const strategy: FireCollectionStrategy = this.findStrategy(changes);
        if (strategy) {
            this.dispose();
            this.execute(strategy);
        }

        if (changes.subscribe) {
            this.dispose();
            this.subscribeBy(this.fireCollectionSubscribe);
        }
    }

    ngOnDestroy() {
        this.dispose();
    }

    private findStrategy(changes: SimpleChanges): FireCollectionStrategy {
        return COLLECTION_CONFIG.find((strategy) => {
            return strategy.changes.some(field => !!changes[field])
                && strategy.require.every(field => !!this[field]);
        });
    }

    private execute(strategy: FireCollectionStrategy) {
        const [ head, ...tail ] = strategy.changes.map(field => this[field]);

        this.collection = this.afs.collection(head, ...tail);
    }

    private subscribeBy(field: string) {
        if (this.collection) {
            this.subscription = this.collection[field].subscribe((value) => {
                this.context.$implicit = value;
                this.viewRef.detectChanges();
            });
        }
    }

    private dispose() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
