import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AppConst } from '../../helper/app-const';
import { ValidationMessages } from '../../helper/validation-message';
import { UploadService } from '../../services/upload.service';
import { StoreService } from '../../services/store.service';
import { SharedService } from '../../services/shared.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { viewImageData } from '../../layout/layout.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-upload-image-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  providers: [UploadService],
  templateUrl: './upload-image-dialog.component.html',
  styleUrl: './upload-image-dialog.component.scss',
})
export class UploadImageDialogComponent {
  uploadImageForm!: FormGroup;
  selectedFile: any = null;
  imagePreviewUrl!: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  maxSizeMB = AppConst.maxSizeMB;
  validationMessage = ValidationMessages;
  uploadProgress: number = 0;
  isApiCalling = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private storeService = inject(StoreService);
  private dialogRef = inject(MatDialogRef<UploadImageDialogComponent>);
  private uploadService = inject(UploadService);
  private sharedService = inject(SharedService);

  constructor(@Inject(MAT_DIALOG_DATA) public imageData: viewImageData) {}
  ngOnInit() {
    console.log(this.imageData);
    this.uploadImageForm = new FormGroup({
      title: new FormControl(
        this.imageData?.type == 'view' ? this.imageData.data.title : '',
        [Validators.required]
      ),
      tags: new FormControl(
        this.imageData?.type == 'view' ? this.imageData.data.tags : '',
        Validators.required
      ),
      uploadFile: new FormControl(
        this.imageData?.type == 'view' ? this.imageData.data.uploadFile : '',
        [Validators.required]
      ),
    });
    if (this.imageData && this.imageData.type == 'view') {
      this.imagePreviewUrl = this.imageData.data.uploadFile;
      this.uploadImageForm.disable();
    }
  }

  //for drop image
  onDrop(event: DragEvent) {
    console.log(event);
    event.preventDefault();
    if (event.dataTransfer) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  //for drop image
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  //for drop image
  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  //for choose file
  onFileSelected(e: any) {
    this.handleFiles(e.target.files);
  }

  //set and preview choose file
  handleFiles(files: FileList): void {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (
        file &&
        allowedTypes.includes(file.type) &&
        file.size <= this.maxSizeMB * 1024 * 1024
      ) {
        this.selectedFile = file;

        // Display preview
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagePreviewUrl = event.target.result;
        };
        reader.readAsDataURL(file);
        this.uploadImageForm.patchValue({
          uploadFile: this.selectedFile,
        });
      } else {
        this.resetFileData();
        if (file) {
          this.uploadImageForm.controls['uploadFile'].setErrors({
            invalidFileType: !allowedTypes.includes(file.type),
            invalidFileSize: file.size > this.maxSizeMB * 1024 * 1024,
          });
        }
      }
    }
  }

  //reset file data
  resetFileData() {
    this.uploadImageForm.patchValue({
      uploadFile: '',
    });
    this.imagePreviewUrl = '';
    this.selectedFile = '';
    this.uploadImageForm.controls['uploadFile'].setErrors(null);
  }

  get tags() {
    return this.uploadImageForm.get('tags');
  }

  //add tag
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our key
    if ((value || '').trim()) {
      if (this.tags) {
        this.tags.setValue([...this.tags.value, value.trim()]);
        this.tags.updateValueAndValidity();
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  //remove tag
  removeTag(key: string): void {
    if (this.tags) {
      const index = this.tags.value.indexOf(key);

      if (index >= 0) {
        this.tags.value.splice(index, 1);
        this.tags.updateValueAndValidity();
      }
    }
  }

  //submit data
  onSubmit() {
    if (this.uploadImageForm.invalid) {
      this.uploadImageForm.markAllAsTouched();
    } else {
      this.uploadImageForm.disable();
      this.isApiCalling = false;
      console.log(this.uploadImageForm.get('uploadFile')?.value.name);
      this.storeService.checkTitleExists(this.uploadImageForm.value).pipe(take(1)).subscribe({
        next: (exists) => {
          console.log(exists,'exi');
          if (!exists) {
            this.uploadService
              .uploadFileToBucket(this.uploadImageForm.value)
              .subscribe({
                next: (res) => {
                  this.uploadProgress = res.progress;
                  if (this.uploadProgress === 100) {
                    if (res.data) {
                      this.storeService
                        .addDataInStore(this.uploadImageForm.value, res.data)
                        .then((result) => {
                          console.log(result);
                          this.isApiCalling = false;
                          this.dialogRef.close('yes');
                        })
                        .catch((err) => {
                          console.log(err);
                          this.isApiCalling = false;
                          this.uploadImageForm.enable();
                          this.sharedService.loggerError(
                            'Something went wrong please try again after sometime.'
                          );
                        });
                    }
                  }
                },
                error: (error) => {
                  this.uploadProgress = 0;
                  this.isApiCalling = false;
                  this.uploadImageForm.enable();
                  this.sharedService.loggerError(
                    'Something went wrong please try again after sometime.'
                  );
                },
              });
          } else {
            console.log('Title already exists');
            this.sharedService.loggerError(
              'Title already exists.'
            );
            this.uploadImageForm.enable();
            this.isApiCalling = false;
          }
        },
      });
    }
  }

  //cancel click
  onCancel() {
    this.dialogRef.close('no');
  }
}
