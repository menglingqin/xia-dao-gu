import boto3
import os
import sys
from pathlib import Path
from typing import Optional

class AWSDeployer:
    """Archived: AWS S3 + CloudFront 部署工具
    保留于 deploy/archive/ 以便审计。
    """
    
    def __init__(self, bucket: str, distribution_id: Optional[str] = None, region: str = "us-east-1"):
        self.bucket = bucket
        self.distribution_id = distribution_id
        self.region = region
        self.s3_client = boto3.client('s3', region_name=region)
        self.cloudfront_client = boto3.client('cloudfront', region_name=region)
        self.build_dir = Path('dist')
    
    def validate(self) -> bool:
        """验证配置"""
        if not self.build_dir.exists():
            print(f"❌ 构建目录不存在: {self.build_dir}")
            return False
        
        try:
            self.s3_client.head_bucket(Bucket=self.bucket)
            print(f"✅ S3 Bucket 可访问: {self.bucket}")
            return True
        except Exception as e:
            print(f"❌ S3 Bucket 不可访问: {e}")
            return False
    
    def upload_to_s3(self) -> bool:
        """上传文件到 S3"""
        try:
            print("📤 上传文件到 S3...")
            
            files_uploaded = 0
            
            for file_path in self.build_dir.rglob('*'):
                if file_path.is_file():
                    relative_path = file_path.relative_to(self.build_dir)
                    
                    if file_path.suffix in ['.html', '.json']:
                        cache_control = "public, max-age=0, must-revalidate"
                        content_type = "text/html" if file_path.suffix == ".html" else "application/json"
                    else:
                        cache_control = "public, max-age=31536000"
                        content_type = self._get_content_type(file_path)
                    
                    self.s3_client.upload_file(
                        str(file_path),
                        self.bucket,
                        str(relative_path),
                        ExtraArgs={
                            'CacheControl': cache_control,
                            'ContentType': content_type,
                        }
                    )
                    
                    files_uploaded += 1
            
            print(f"✅ 已上传 {files_uploaded} 个文件")
            return True
        
        except Exception as e:
            print(f"❌ 上传失败: {e}")
            return False
    
    def invalidate_cloudfront(self) -> bool:
        """清除 CloudFront 缓存"""
        if not self.distribution_id:
            print("⚠️  未设置 CloudFront Distribution ID，跳过缓存清除")
            return True
        
        try:
            print("🔄 清除 CloudFront 缓存...")
            
            response = self.cloudfront_client.create_invalidation(
                DistributionId=self.distribution_id,
                InvalidationBatch={
                    'Paths': {
                        'Quantity': 1,
                        'Items': ['/*']
                    },
                    'CallerReference': str(os.urandom(16).hex())
                }
            )
            
            print(f"✅ 缓存清除请求已提交: {response['Invalidation']['Id']}")
            return True
        
        except Exception as e:
            print(f"❌ 缓存清除失败: {e}")
            return False
    
    @staticmethod
    def _get_content_type(file_path: Path) -> str:
        mime_types = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
        }
        return mime_types.get(file_path.suffix, 'application/octet-stream')
    
    def deploy(self) -> bool:
        print("🚀 启动 AWS 部署流程")
        print("-" * 50)
        
        if not self.validate():
            return False
        
        if not self.upload_to_s3():
            return False
        
        if not self.invalidate_cloudfront():
            return False
        
        print("-" * 50)
        print("🎉 部署完成！")
        domain = f"{self.bucket}.s3.{self.region}.amazonaws.com"
        print(f"📍 网站地址: https://{domain}")
        return True


def main():
    bucket = os.getenv('AWS_S3_BUCKET')
    distribution_id = os.getenv('AWS_CLOUDFRONT_DISTRIBUTION_ID')
    region = os.getenv('AWS_REGION', 'us-east-1')
    
    if not bucket:
        print("❌ 错误: 未设置 AWS_S3_BUCKET 环境变量")
        sys.exit(1)
    
    deployer = AWSDeployer(bucket, distribution_id, region)
    
    if not deployer.deploy():
        sys.exit(1)


if __name__ == '__main__':
    main()
