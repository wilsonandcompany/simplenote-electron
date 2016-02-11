import React, { PropTypes } from 'react'
import classNames from 'classnames'
import NoteDetail from './note-detail'
import TagField from './tag-field'
import NoteToolbar from './note-toolbar'
import RevisionSelector from './revision-selector'

export default React.createClass( {

	propTypes: {
		editorMode: PropTypes.oneOf( [ 'edit', 'markdown' ] ),
		note: PropTypes.object,
		revisions: PropTypes.array,
		markdownEnabled: PropTypes.bool,
		fontSize: PropTypes.number,
		onSetEditorMode: PropTypes.func.isRequired,
		onUpdateContent: PropTypes.func.isRequired,
		onUpdateNoteTags: PropTypes.func.isRequired,
		onTrashNote: PropTypes.func.isRequired,
		onRestoreNote: PropTypes.func.isRequired,
		onShareNote: PropTypes.func.isRequired,
		onDeleteNoteForever: PropTypes.func.isRequired,
		onRevisions: PropTypes.func.isRequired,
		onCloseNote: PropTypes.func.isRequired,
		onNoteInfo: PropTypes.func.isRequired
	},

	getDefaultProps: function() {
		return {
			editorMode: 'edit',
			note: {
				data: {
					tags: []
				}
			}
		};
	},

	componentWillReceiveProps: function() {
		this.setState( { revision: null } );
	},

	getInitialState: function() {
		return {
			revision: null
		}
	},

	onViewRevision: function( revision ) {
		this.setState( { revision: revision } );
	},

	onSelectRevision: function( revision ) {
		console.log( 'Accept revision: ', revision );
	},

	render: function() {
		var { editorMode, note, revisions, markdownEnabled, fontSize } = this.props;
		var revision = this.state.revision || note;
		var tags = revision && revision.data && revision.data.tags || [];
		const isTrashed = !!( note && note.data.deleted );

		markdownEnabled = markdownEnabled && revision &&
			revision.data && revision.data.systemTags &&
			revision.data.systemTags.indexOf( 'markdown' ) !== -1;

		return (
			<div className="note-editor theme-color-bg theme-color-fg">
				<div className="note-editor-controls theme-color-border">
					<NoteToolbar
						note={note}
						onTrashNote={this.props.onTrashNote}
						onRestoreNote={this.props.onRestoreNote}
						onShareNote={this.props.onShareNote}
						onDeleteNoteForever={this.props.onDeleteNoteForever}
						onRevisions={this.props.onRevisions}
						onCloseNote={this.props.onCloseNote}
						onNoteInfo={this.props.onNoteInfo} />
				</div>
				<div className="note-editor-content theme-color-border">
					{!!markdownEnabled && this.renderModeBar()}
					<div className="note-editor-detail">
						<NoteDetail
							note={revision}
							previewingMarkdown={markdownEnabled && editorMode === 'markdown'}
							onChangeContent={this.props.onUpdateContent}
							fontSize={fontSize} />
					</div>
					{!!revisions &&
						<RevisionSelector
							revisions={revisions}
							onViewRevision={this.onViewRevision}
							onSelectRevision={this.onSelectRevision} />
					}
				</div>
				{ ! isTrashed &&
					<TagField
						tags={tags}
						onUpdateNoteTags={this.props.onUpdateNoteTags.bind( null, note ) } />
				}
			</div>
		)
	},

	renderModeBar() {
		var { editorMode } = this.props;

		return (
			<div className="note-editor-mode-bar segmented-control">
				<button type="button"
					className={classNames( 'button button-segmented-control button-compact', { active: editorMode === 'edit' } )}
					onClick={this.props.onSetEditorMode.bind( null, 'edit' )}>Edit</button>
				<button type="button"
					className={classNames( 'button button-segmented-control button-compact', { active: editorMode === 'markdown' } )}
					onClick={this.props.onSetEditorMode.bind( null, 'markdown' )}>Preview</button>
			</div>
		);
	}
} );
